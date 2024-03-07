import { Router } from "express";
import testController from "../controllers/test/testController.js";

const testingRoutes = Router();

testingRoutes.post("/", testController);

export default testingRoutes;