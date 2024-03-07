import mysqlDriver from "../database/mysqlDriver.js";

const changeSuppliersStatus = async () => {

  let conn = null;

  try {
    conn = await mysqlDriver.awaitGetConnection();
    await conn.awaitQuery("UPDATE supplier SET isUpdated = 0");
    
    console.log('|::| Status de los proveedores actualizado ');
  } catch (error) {
    console.log(
      "Error al ejecutar el cron para actualizar el estado de los proveedores"
    );
    console.log("Error ocurrido: ", error);
  } finally {
    if (conn) await conn.release();
  }
};

export default changeSuppliersStatus;
