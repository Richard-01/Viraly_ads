import { Router } from "express";
import { createSupplierController, updateAllSuppliersController, deleteSupplierController } from "../controllers/suppliers/index.js";

const suppliersRoutes = Router();

suppliersRoutes.post("/create_supplier", createSupplierController);
suppliersRoutes.put("/update_all_suppliers", updateAllSuppliersController);
suppliersRoutes.delete(`/delete_supplier`, deleteSupplierController);

export default suppliersRoutes;
