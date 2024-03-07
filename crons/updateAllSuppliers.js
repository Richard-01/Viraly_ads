import puppeteer from "puppeteer";
import mysqlDriver from "../database/mysqlDriver.js";
import { getSupplierData } from "../controllers/suppliers/index.js";
import sendEmail from "../utils/helpers/sendEmail.js";

const updateAllSuppliers = async () => {

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
  let successfullUpdates = 0;
  let missingSuppliers = [];
  let suppliers = [];
  try {
    conn = await mysqlDriver.awaitGetConnection();

    const suppliersQuery = `SELECT id FROM supplier WHERE isUpdated = 0`;
    suppliers = await conn.awaitQuery(suppliersQuery);

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

      await page.close();
      if (isSuccessful) {
        successfullUpdates++;
        continue;
      }
      missingSuppliers.push(supplierPage.id);
    }

    missingSuppliers = (missingSuppliers.length > 0)
      ? missingSuppliers.join(', ')
      : '0';

    console.log('|::| Proveedores actualizados');
    await sendEmail({
      subject: `[Alibaba] Actualización de proveedores - Proceso exitoso`,
      emailTemplate: 'suppliers'
    },
    {
      body: "La actualización de los proveedores se ha completado con éxito",
      successfullUpdates: `${successfullUpdates} de ${suppliers.length}`,
      missingSuppliers,
      status: "Success"
    }, 
    ["daniel.salazar@shiipy.com", "manager.viraly@gmail.com", "hansrondon1998@gmail.com"]);
  } catch (error) {
    console.log("Error al actualizar los provedores: ");
    console.log("Error ocurrido: ", error);
    await sendEmail({
      subject: `[Alibaba] Actualización de proveedores - Proceso Fallido`,
      emailTemplate: 'suppliers'
    },
    {
      body: `La actualización de los proveedores no se ha completado con éxito. Error: ${JSON.stringify(error)}`,
      successfullUpdates: `${successfullUpdates} de ${suppliers.length}`,
      missingSuppliers,
      status: "Error"
    }, 
    ["daniel.salazar@shiipy.com", "manager.viraly@gmail.com", "hansrondon1998@gmail.com"]);
  } finally {
    if (browser) await browser.close();
    if (conn) await conn.release();
  }
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

export default updateAllSuppliers;
