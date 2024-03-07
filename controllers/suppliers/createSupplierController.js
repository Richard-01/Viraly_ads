import mysqlDriver from "../../database/mysqlDriver.js";
import getSupplierData from "./getSupplierData.js";
import puppeteer from "puppeteer";

const createSupplierController = async (req, res) => {
  const { userId, pages: supplierPages, productId } = req.body;
  const { isValid, message } = validateRequestBody(req.body);

  if (!isValid) {
    return res.status(422).send({
      error: true,
      message: message,
    });
  }

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
    ],
    defaultViewport: null,
  });
  const puppeteerPages = [];
  let conn = null;
  try {
    conn = await mysqlDriver.awaitGetConnection();

    const userQuery = "SELECT id, fk_roleId FROM user WHERE id = ?";
    const [user] = await conn.awaitQuery(userQuery, [userId]);

    if (!user) {
      return res.status(422).send({
        error: true,
        messages: {
          en: "The user was not found, please log in again",
          es: "El usuario no fue encontrado, por favor inicia sesión de nuevo",
          pt: "O usuário não foi encontrado, faça login novamente",
        },
      });
    }

    const productQuery = "SELECT id FROM product WHERE id = ?";
    const [product] = await conn.awaitQuery(productQuery, [productId]);

    if (!product) {
      return res.status(422).send({
        error: true,
        messages: {
          en: "The product was not found",
          es: "El producto no fue encontrado",
          pt: "O produto não foi encontrado",
        },
      });
    }

    const currentSuppliersQuery =
      "SELECT id FROM supplier WHERE fk_productId = ?";
    const currentSuppliers = await conn.awaitQuery(currentSuppliersQuery, [
      productId,
    ]);

    const deleteOldSuppliersQuery =
      "DELETE FROM supplier WHERE fk_productId = ? AND id NOT IN (?)";
    await conn.awaitQuery(deleteOldSuppliersQuery, [productId, supplierPages]);

    const missingSuppliers = [];
    let successfullInserts = 0;

    currentSuppliers.forEach((supplier) => {
      const currentSupplier = supplierPages.findIndex(
        (page) => page == supplier.id
      );
      if (currentSupplier > -1) {
        supplierPages.splice(currentSupplier, 1);
        successfullInserts++;
      }
    });

    for await (const supplierPage of supplierPages) {
      const page = await browser.newPage();
      await page.setUserAgent(
        "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
      );

      await page.setRequestInterception(true);
      const uselessResourceTypes = ["image", "other", "media", "xhr", "font"];

      let abortRequest = false;
      page.on("request", (request) => {
        const resourceType = request.resourceType();

        uselessResourceTypes.includes(resourceType) || abortRequest
          ? request.abort()
          : request.continue();

        if (request.url().includes("trade-assurance-protection.js")) {
          setTimeout(() => {
            abortRequest = true;
          }, 1000);
        }
      });

      await page.goto(supplierPage, {
        waitUntil: ["domcontentloaded", "networkidle2"],
        timeout: 90000,
      });

      puppeteerPages.push(page);
    }

    for await (const page of puppeteerPages) {
      
      const supplier = await getSupplierData(page);

      if (supplier.error) {
        missingSuppliers.push(supplier.url);
        console.log("Error al agregar el proveedor: ", supplier.url);
        console.log(supplier.errorMessage);
        continue;
      }

      const {
        url,
        name,
        isCertified,
        years,
        numberTransactions,
        moneyTransactions,
        responseTime,
        deliveriesPercentage,
        price,
      } = supplier.supplierData;

      const supplierQuery = `INSERT IGNORE INTO supplier (
        id, 
        fk_productId, 
        name, 
        certified, 
        years, 
        numberTransactions, 
        moneyTransactions, 
        responseTime, 
        deliveriesPercentage, 
        price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await conn.awaitQuery(supplierQuery, [
        url,
        productId,
        name,
        isCertified,
        years,
        numberTransactions,
        moneyTransactions,
        responseTime,
        deliveriesPercentage,
        price,
      ]);
      successfullInserts++;
      await page.close();
    }

    return res.status(200).send({
      error: false,
      successfullInserts,
      missingSuppliers,
    });
  } catch (error) {
    console.log("Error al scrapear un producto: ");
    console.log("Error ocurrido: ", error);

    return res.status(500).send({
      error: true,
      messages: {
        en: "An unexpected mistake happened, please try again later.",
        es: "Ocurrió un error inesperado, por favor intentalo de nuevo más tarde.",
        pt: "Um erro inesperado aconteceu, tente novamente mais tarde.",
      },
    });
  } finally {
    if (browser) await browser.close();
    if (conn) await conn.release();
  }
};

const validateRequestBody = (body) => {
  const { userId, pages, productId } = body;

  if (!userId || typeof userId !== "string") {
    return {
      isValid: false,
      message: "the field userId is a field require ad must be a string",
    };
  }

  if (!productId || typeof productId !== "string") {
    return {
      isValid: false,
      message: "the field productId is a field require ad must be a string",
    };
  }

  if (!pages || !Array.isArray(pages)) {
    return {
      isValid: false,
      message: "the field pages is a field require ad must be an string array",
    };
  }

  if (pages.length > 3) {
    return {
      isValid: false,
      message: "Only a maximum of 3 pages can be submitted.",
    };
  }

  pages.forEach((pageUrl) => {
    if (!pageUrl || typeof pageUrl !== "string") {
      return {
        isValid: false,
        message: `${pageUrl} is not a valid url`,
      };
    }

    if (!pageUrl.includes("alibaba.com")) {
      return {
        isValid: false,
        message: `${pageUrl} is not a String data type.`,
      };
    }
  });

  return { isValid: true, message: null };
};

export default createSupplierController;
