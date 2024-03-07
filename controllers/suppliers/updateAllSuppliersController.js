import mysqlDriver from "../../database/mysqlDriver.js";
import { updateAllSuppliers } from "../../crons/index.js";

const updateAllSuppliersController = async (req, res) => {
  const { userId } = req.query;
  const { isValid, message } = validateRequestParams(req.query);

  if (!isValid) {
    return res.status(422).send({
      error: true,
      message: message,
    });
  }

  let conn = null;
  try {
    conn = await mysqlDriver.awaitGetConnection();

    const userQuery = `SELECT fk_roleId role FROM user WHERE id = ?`;
    const [user] = await conn.awaitQuery(userQuery, [userId]);
    const { role } = user;

    if (!user || (role !== 1 && role !== 2)) {
      res.status(401).send({
        error: true,
        messages: {
          en: "You are not authorized to perform this action",
          es: "No tienes permisos para realizar esta acción",
          pt: "Você não tem permissão para realizar esta ação",
        }
      })
    } else {
      res.status(204).send();
      await updateAllSuppliers();
    }

  } catch (error) {
    console.log("Error al actualizar los provedores: ");
    console.log("Error ocurrido: ", error);
  } finally {
    if (conn) await conn.release();
  }
};

const validateRequestParams = (queryParameters) => {
  const { userId } = queryParameters;
  
  if(!userId) {
    return {
      isValid: false,
      message: "The field userId is a field require ad must be a string"
    }
  }

  return { isValid: true, message: null };
};

export default updateAllSuppliersController;
