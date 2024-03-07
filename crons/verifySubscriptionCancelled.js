import dayjs from "dayjs";
import mysqlDriver from "../database/mysqlDriver.js";
import mysqlDriverStaging from "../database/mysqlDriverStaging.js";

const verifySubscriptionCancelled = async () => {

  let conn = null;

  try {
    conn = await mysqlDriver.awaitGetConnection();

    const subscriptionsCancelled = await conn.awaitQuery(
      "SELECT id, activeUntil FROM subscription WHERE statusPayment = 'cancelled'"
    );

    for await (const { activeUntil, id } of subscriptionsCancelled) {
      if (dayjs().isAfter(activeUntil)) {
        const updateSubscriptionQuery =
          "UPDATE subscription SET statusPayment = 'payment', subName = 'free', clientName = 'Free' WHERE id = ?";
        await conn.awaitQuery(updateSubscriptionQuery, [id]);
      }
    }

    console.log('|::| Subscripciones actualizadas');
  } catch (error) {
    console.log("Error al ejecutar el cron para actualizar subscripciones canceladas");
    console.log("Error ocurrido: ", error);
  } finally {
    if (conn) await conn.release();
    verifySubscriptionCancelledStaging();
  }
};

const verifySubscriptionCancelledStaging = async () => {

  let conn = null;

  try {
    conn = await mysqlDriverStaging.awaitGetConnection();

    const subscriptionsCancelled = await conn.awaitQuery(
      "SELECT id, clientName, activeUntil FROM subscription WHERE statusPayment = 'cancelled'"
    );

    for await (const { activeUntil, clientName, id } of subscriptionsCancelled) {
      if (dayjs().isAfter(activeUntil)) {
        const updateSubscriptionQuery = (clientName === 'Free trial')
          ? "UPDATE subscription SET statusPayment = 'payment', subName = 'free', clientName = 'Free', activeUntil = null WHERE id = ?"
          : "UPDATE subscription SET subName = 'free', clientName = 'Free' WHERE id = ?";
        await conn.awaitQuery(updateSubscriptionQuery, [id]);
      }
    }

    console.log('|::| Subscripciones actualizadas');
  } catch (error) {
    console.log("Error al ejecutar el cron para actualizar subscripciones canceladas");
    console.log("Error ocurrido: ", error);
  } finally {
    if (conn) await conn.release();
  }
};

export default verifySubscriptionCancelled;
