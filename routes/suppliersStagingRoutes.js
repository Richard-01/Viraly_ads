import { Router } from "express";
import { createSupplierController, updateAllSuppliersController, deleteSupplierController } from "../controllers/suppliers_staging/index.js";

const suppliersStagingRoutes = Router();

suppliersStagingRoutes.post("/create_supplier_staging", createSupplierController);
suppliersStagingRoutes.put("/update_all_suppliers_staging", updateAllSuppliersController);
suppliersStagingRoutes.delete(`/delete_supplier_staging`, deleteSupplierController);

export default suppliersStagingRoutes;
