import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import fetch from "node-fetch";
import UTC from "dayjs/plugin/utc.js";

import mysqlDriver from "../database/mysqlDriver.js";
import getAdsModel from "../database/models/getAdsModel.js";
import sendEmail from "../utils/helpers/sendEmail.js";
dayjs.extend(UTC);

const updateAds = async () => {

  let conn = null;
  try {
    const Ads = await getAdsModel();

    const totalAds = await Ads.count({
      $or: [
        { updatedIn: { $lt: dayjs().locale(es).subtract(3, 'days').toDate() } },
        { updatedIn: { $exists: false } }
      ],
      updateIsPossible: { $exists: false },
    }).exec();
    const iterations = Math.ceil(totalAds / 50);
    console.log(totalAds);

    conn = await mysqlDriver.awaitGetConnection();
    const mineaTokenQuery = "SELECT token mineaToken FROM ads_platform WHERE platform = 'Minea'";
    const [{mineaToken}] = await mysqlDriver.awaitQuery(mineaTokenQuery);

    for (let i = 0; i < iterations; i++) {
      const adsForUpdates = await Ads.find({ 
        $or: [
          { updatedIn: { $lt: dayjs().locale(es).subtract(10, 'days').toDate() } },
          { updatedIn: { $exists: false } }
        ],
        updateIsPossible: { $exists: false },
      }).limit(50).lean();

      const updatedIn = dayjs().locale(es).toDate();

      for await(const ad of adsForUpdates) {
        const url = `https://app.minea.com/_next/data/${mineaToken}/posts/${ad.id}.json?tab=ad_analysis&id=${ad.id}`;
        const adDetail = await fetch(url);

        if (adDetail.status !== 200) {
          await Ads.updateOne({id: ad.id}, {updateIsPossible: false}).exec();
          continue;
        }

        const { pageProps } = await adDetail.json();
        const { ...adData } = pageProps.data.getAd;
        await Ads.updateOne({id: ad.id}, 
          { 
            ...adData, 
            updatedIn,
          }
        ).exec();
      }
    }
  } catch (error) {
    console.log("Error al actualizar los anuncios:");
    console.log(error);

    await sendEmail(
      {
        subject: `Actualización de anuncios - Error al actualizar los ads`,
      },
      {
        body: JSON.stringify(error),
        status: "Error",
      },
      ["daniel.salazar@shiipy.com", "manager.viraly@gmail.com", "hansrondon1998@gmail.com"]
    );
  } finally {
    if (conn) await conn.release();
  }
};

export default updateAds;
