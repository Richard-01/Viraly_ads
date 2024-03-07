import fetch from "node-fetch";
import getAdsModel from "../database/models/getAdsModel.js";
import mysqlDriver from "../database/mysqlDriver.js";
import sendEmail from "../utils/helpers/sendEmail.js";

const Ads = await getAdsModel();

const createDetailedAds = async () => {

  let conn = null;

  try {
    conn = await mysqlDriver.awaitGetConnection();

    const mineaTokenQuery =
      "SELECT token FROM ads_platform WHERE platform = 'Minea'";
    const [{ token: mineaToken }] = await mysqlDriver.awaitQuery(
      mineaTokenQuery
    );
    await conn.release();
    conn = null;

    const totalAds = await Ads.count({ isCompleted: false }).exec();
    const deletedAds = [];
    let adsWithErrors = 0;
    const iterations = Math.ceil(totalAds / 40);

    for (let i = 0; i < iterations; i++) {
      const ads = await Ads.find({ isCompleted: false })
        .select("id _id")
        .limit(40)
        .exec();

      for await (let ad of ads) {
        const url = `https://app.minea.com/_next/data/${mineaToken}/en/posts/${ad.id}.json?tab=ad_analysis&id=${ad.id}`;
        const adDetail = await fetch(url);
        const { pageProps } = await adDetail.json().catch(error => {
          console.error(`Ad with error: ${ad.id}`);
          adsWithErrors++;
          deleteAdWithError(ad);
          return { pageProps: null }
        });

        if (!pageProps) continue;

        const { ...adData } = pageProps.data.getAd;
        
        if (adData.attachments.length < 1) {
          await Ads.deleteOne(ad);
          deletedAds.push(ad.id);
          continue;
        }

        await Ads.replaceOne(ad, { ...adData, isCompleted: true });
      }
    }

    await sendEmail(
      {
        subject: `Obtención de detalles de anuncios - Proceso exitoso`,
      },
      {
        body: `La obtención de detalles de anuncios se ha completado con éxito, se agregaron los detalles a un total de: <strong>${totalAds} anuncios</strong>. 
        <br><br>Anuncios con errores eliminados: <strong>${adsWithErrors}</strong>
        <br><br>Se han eliminado los siguientes anuncios por no tener imágenes: <br>${deletedAds.join(', ')}`,
        status: "Success",
      },
      ["hansrondon1998@gmail.com", "manager.viraly@gmail.com"]
    );
  } catch (error) {
    console.log("Error al obtener el detalle de los anuncios:");
    console.log(error);

    await sendEmail(
      {
        subject: `Obtención de detalles de anuncios - Error al obtener los ads`,
      },
      {
        body: JSON.stringify(error),
        status: "Error",
      },
      ["hansrondon1998@gmail.com", "manager.viraly@gmail.com"]
    );
  } finally {
    if (conn) await conn.release();
  }
};

const deleteAdWithError = async (ad) => await Ads.deleteOne(ad);

export default createDetailedAds;
