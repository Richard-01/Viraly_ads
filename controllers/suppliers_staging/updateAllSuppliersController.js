import puppeteer from "puppeteer";
import mysqlDriverStaging from "../../database/mysqlDriverStaging.js";
import { getSupplierData } from "../suppliers/index.js";
import sendEmail from "../../utils/helpers/sendEmail.js";

const updateAllSuppliersController = async (req, res) => {
  const { userId } = req.query;
  const { isValid, message } = validateRequestParams(req.query);

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
  let conn = null;
  try {
    conn = await mysqlDriverStaging.awaitGetConnection();

    const userQuery = `SELECT fk_roleId role FROM user WHERE id = ?`;
    const [{role}] = await conn.awaitQuery(userQuery, [userId]);

    if (!role || (role !== 1 && role !== 2)) {
      res.status(401).send({
        error: true,
        messages: {
          en: "You are not authorized to perform this action",
          es: "No tienes permisos para realizar esta acción",
          pt: "Você não tem permissão para realizar esta ação",
        }
      })
    }

    res.status(204).send();

    const suppliersQuery = `SELECT id FROM supplier WHERE isUpdated = 0`;
    const suppliers = await conn.awaitQuery(suppliersQuery);

    let successfullUpdates = 0;
    let missingSuppliers = [];

    for await (const supplierPage of suppliers) {
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
          abortRequest = true;
        }
      });

      await page.goto(supplierPage.id, {
        waitUntil: ["domcontentloaded"],
      });

      const isSuccessful = await updateSupplier(page, conn);

      if (isSuccessful) {
        successfullUpdates++;
        continue;
      }

      missingSuppliers.push(supplierPage.id);
      await page.close();
    }

    await sendEmail({
      subject: `[Alibaba] Actualización de proveedores - Proceso exitoso`,
      emailTemplate: 'suppliers'
    },
    {
      body: "La actualización de los proveedores se ha completado con éxito",
      successfullUpdates: `${successfullUpdates} de ${suppliers.length}`,
      missingSuppliers: missingSuppliers.join(', '),
      status: "Success"
    }, 
    ["daniel.salazar@shiipy.com"]);
  } catch (error) {
    console.log("Error al actualizar los provedores: ");
    console.log("Error ocurrido: ", error);
  } finally {
    if (browser) await browser.close();
    if (conn) await conn.release();
  }
};

const validateRequestParams = (queryParams) => {
  const { userId } = queryParams;

  if(!userId) {
    return {
      isValid: false,
      message: "The field userId is a field require ad must be a string"
    }
  }

  return { isValid: true, message: null };
};

const updateSupplier = async (page, conn) => {
  const supplier = await getSupplierData(page, true);

  if (supplier.error) {
    console.log("Error al agregar el proveedor: ", supplier.url);
    console.log(supplier.errorMessage);
    return false;
  }

  const {
    url,
    name,
    years,
    numberTransactions,
    moneyTransactions,
    responseTime,
    deliveriesPercentage,
    price,
  } = supplier.supplierData;

  const supplierQuery = `UPDATE supplier SET
    name = ?,
    years = ?,
    numberTransactions = ?,
    moneyTransactions = ?,
    responseTime = ?,
    deliveriesPercentage = ?,
    price = ?,
    isUpdated = ?
  WHERE id = ?`;

  await conn.awaitQuery(supplierQuery, [
    name,
    years,
    numberTransactions,
    moneyTransactions,
    responseTime,
    deliveriesPercentage,
    price,
    true,
    url,
  ]);

  return true;
};

export default updateAllSuppliersController;
