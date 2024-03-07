import cron from "node-cron";
import { 
  changeSuppliersStatus, 
  createAds, 
  createDetailedAds, 
  payReferralCommission, 
  payReferralCommissionStaging, 
  //updateAds,
  updateAllSuppliers, 
  verifySubscriptionCancelled, 
} from "./index.js";

const startCrons = () => {
  const cronOptions = { 
    scheduled: true,
    timezone: 'UTC'
  }

  // Todos los domingos a las 3:40 AM (Col)
  cron.schedule('40 08 * * 0', changeSuppliersStatus, cronOptions);

  // Todos los domingos a las 5:00 AM (Col)
  cron.schedule('00 10 * * 0', updateAllSuppliers, cronOptions);

  // Todos los domingos a las 7:00 AM (Col)
  cron.schedule('00 12 * * 0', updateAllSuppliers, cronOptions);

  // Todos los días a las 12:00 AM (Col)
  cron.schedule('00 05 * * *', verifySubscriptionCancelled, cronOptions);

  // Todos los días a las 12:00 PM (Col)
  cron.schedule('00 17 * * *', verifySubscriptionCancelled, cronOptions);

  // Todos los días a las 2:00 AM (Col)
  cron.schedule('00 07 * * *', () => createAds('en', 'true'), cronOptions);

  // Todos los días a las 2:20 AM (Col)
  cron.schedule('20 07 * * *', () => createAds('es'), cronOptions);

  // Cada 15 días (01 y 16) a las 03:10 AM (Col)
  //cron.schedule('10 08 01-16 * *', updateAds, cronOptions);

  // Todos los días a las 3:00 AM (Col)
  cron.schedule('00 08 * * *', createDetailedAds, cronOptions);

  // Todos los días a las 12:05 AM (Col)
  cron.schedule('05 05 * * *', payReferralCommission, cronOptions);

  // Todos los días a las 12:15 AM (Col)
  cron.schedule('15 05 * * *', payReferralCommissionStaging, cronOptions);
}

export default startCrons;