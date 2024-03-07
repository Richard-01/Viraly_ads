import { Router } from "express";
import { payReferralCommissionController, payReferralCommissionStagingController } from "../controllers/wallets/index.js";


const walletsRoutes = Router();

walletsRoutes.post("/commission", payReferralCommissionController);
walletsRoutes.post("/staging/commission", payReferralCommissionStagingController);

export default walletsRoutes;
