import mysqlDriver from "../../database/mysqlDriver.js";
import { payReferralCommission } from "../../crons/index.js";

const payReferralCommissionController = async (req, res) => {
  const { userId } = req.body;
  const { isValid, message } = validateRequestBody(req.body);

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
      return res.status(401).send({
        error: true,
        messages: {
          en: "You are not authorized to perform this action",
          es: "No tienes permisos para realizar esta acción",
          pt: "Você não tem permissão para realizar esta ação",
        },
      });
    }

    res.status(204).send();
    if (conn) await conn.release();
    await payReferralCommission();
  } catch (error) {
    console.log("Error al pagar las comisiones (Controller): ");
    console.log("Error ocurrido: ", error);
  }
};

const validateRequestBody = (bodyParameters) => {
  const { userId } = bodyParameters;

  if (!userId) {
    return {
      isValid: false,
      message: "The field userId is a field require ad must be a string",
    };
  }

  return { isValid: true, message: null };
};

export default payReferralCommissionController;
