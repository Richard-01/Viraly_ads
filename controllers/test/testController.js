import updateAds from "../../crons/updateAds.js";

const testController = async (req, res) => {
  await updateAds();

  return res.status(204).send();
};

export default testController;
