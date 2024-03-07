import getAdsModel from "../database/models/getAdsModel.js";

const deleteEmptyAds = async () => {
  try {
    const Ads = await getAdsModel();
    await Ads.deleteMany({ attachments: { $size: 0 } });
  } catch (error) {
    console.log("Error al eliminar los anuncios:");
    console.log(error);
  }
};

export default deleteEmptyAds;