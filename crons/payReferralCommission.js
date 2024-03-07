import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import UTC from "dayjs/plugin/utc.js";
import { toFloat } from '../utils/helpers/toFloat.js'
dayjs.extend(UTC);

import mysqlDriver from "../database/mysqlDriver.js";
import mysqlDriverStaging from "../database/mysqlDriverStaging.js";
import createTransaction from "../utils/helpers/wallets/createTransaction.js";

const payReferralCommission = async () => {

  let conn = null;
  try {
    conn = await mysqlDriver.awaitGetConnection();

    const pendingCommissions = await conn.awaitQuery(
      `SELECT c.commissionId, c.referredBy, c.referralCommission, c.billAmount, c.billingId, c.referredUserId, u.walletId, u.email
      FROM commission c
      INNER JOIN user u 
      ON u.id = c.referredBy
      WHERE c.status = 'pending' 
      AND TIMESTAMPDIFF(DAY, c.createdAt, DATE(NOW())) > 29
      AND transactionId IS NULL`
    );

    for await (const commission of pendingCommissions) {
      const amount = toFloat((commission.billAmount*commission.referralCommission)/100);
      const transactionBody = {
        fromAccountId: commission.walletId,
        type: "external-in",
        motive: "commision",
        guideId: commission.commissionId,
        amount,
        label: `Me pagaron por: Comisión de la factura ${commission.billingId} por el monto de: $${amount}`,
        description: `Pago de comisión del ${commission.referralCommission}% por factura ${commission.billingId} del usuario ${commission.email} por el monto de $${amount}`,
      };
      
      const { status, data } = await createTransaction(transactionBody, 'production');

      if (status === 200) {
        const updateCommissionQuery = "UPDATE commission SET status = 'payOut', transactionId = ?, payAt = ? WHERE commissionId = ?";
        await conn.awaitQuery(updateCommissionQuery, [
          data.data.transactionId,
          dayjs().locale(es).toDate(),
          commission.commissionId
        ]);
      }
    }

    console.log('|::| Pago de comisiones realizado - Producción');
  } catch (error) {
    console.log( "Error al pagar las comisiones - Producción" );
    console.log("Error ocurrido: ", error);
  } finally {
    if (conn) await conn.release();
  }
};

const payReferralCommissionStaging = async () => {

  let conn = null;

  try {
    conn = await mysqlDriverStaging.awaitGetConnection();

    const pendingCommissions = await conn.awaitQuery(
      `SELECT c.commissionId, c.referredBy, c.referralCommission, c.billAmount, c.billingId, c.referredUserId, u.walletId, u.email 
      FROM commission c
      INNER JOIN user u 
      ON u.id = c.referredBy
      WHERE c.status = 'pending' 
      AND TIMESTAMPDIFF(DAY, c.createdAt, DATE(NOW())) > 29
      AND transactionId IS NULL`
    );

    for await (const commission of pendingCommissions) {
      const amount = toFloat((commission.billAmount*commission.referralCommission)/100);
      console.log(amount);
      const transactionBody = {
        fromAccountId: commission.walletId,
        type: "external-in",
        motive: "commision",
        guideId: commission.commissionId,
        amount,
        label: `Me pagaron por: Comisión de la factura ${commission.billingId} por el monto de: $${amount}`,
        description: `Pago de comisión del ${commission.referralCommission}% por factura ${commission.billingId} del usuario ${commission.email} por el monto de $${amount}`,
      };
      
      const { status, data } = await createTransaction(transactionBody, 'staging');

      if (status === 200) {
        const updateCommissionQuery = "UPDATE commission SET status = 'payOut', transactionId = ?, payAt = ? WHERE commissionId = ?";
        await conn.awaitQuery(updateCommissionQuery, [
          data.data.transactionId,
          dayjs().locale(es).toDate(),
          commission.commissionId
        ]);
      }
    }

    console.log('|::| Pago de comisiones realizado - Staging');
  } catch (error) {
    console.log( "Error al pagar las comisiones" );
    console.log("Error ocurrido: ", error);
  } finally {
    if (conn) await conn.release();
  }
};

export {
  payReferralCommission,
  payReferralCommissionStaging
}
