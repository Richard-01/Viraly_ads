import mysqlDriverStaging from "../../database/mysqlDriverStaging.js";
import { payReferralCommissionStaging } from "../../crons/index.js";


const payReferralCommissionStagingController = async (req, res) => {
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
    conn = await mysqlDriverStaging.awaitGetConnection();

    const userQuery = `SELECT fk_roleId role FROM user WHERE id = ?`;
    const [{role}] = await conn.awaitQuery(userQuery, [userId]);

    if (!role || (role !== 1 && role !== 2)) {
      return res.status(401).send({
        error: true,
        messages: {
          en: "You are not authorized to perform this action",
          es: "No tienes permisos para realizar esta acción",
          pt: "Você não tem permissão para realizar esta ação",
        }
      })
    }

    res.status(204).send();
    if (conn) await conn.release();
    await payReferralCommissionStaging();
    
  } catch (error) {
    console.log("Error al pagar las comisiones (Controller): ");
    console.log("Error ocurrido: ", error);
  }
};

const validateRequestBody = (bodyParams) => {
  const { userId } = bodyParams;

  if(!userId) {
    return {
      isValid: false,
      message: "The field userId is a field require ad must be a string"
    }
  }

  return { isValid: true, message: null };
};

export default payReferralCommissionStagingController;
