import { Router } from "express";
import { createAdsController, createDetailedAdsController, updateAdsController } from "../controllers/ads/index.js";

const adsRoutes = Router();

adsRoutes.post("/", createAdsController);
adsRoutes.post("/details", createDetailedAdsController);
adsRoutes.put("/", updateAdsController);

export default adsRoutes;
