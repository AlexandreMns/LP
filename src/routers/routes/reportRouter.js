import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { ReportService } from "../../services/controllers/reportService.js";
import  ReportController  from "../../controllers/reportController.js";
import authorize from "../../middlewares/authorize.js";
import { roles } from "../../models/usersModel.js";

const router = express.Router();
const reportService = new ReportService();
const reportController = new ReportController(reportService);

// ==========================ADMIN ROUTES==========================
router
  .get("/all-reports", verifyToken, authorize(roles.ADMIN), reportController.getAllReports)
  .get("/report/:id", verifyToken, authorize(roles.ADMIN), reportController.getReportById)
  .get("/property/:id", verifyToken, authorize(roles.ADMIN), reportController.getReportByProperty)
  .get("/client/:id", verifyToken, authorize(roles.ADMIN), reportController.getReportByClient)
  .get("/agent/:id", verifyToken, authorize(roles.ADMIN), reportController.getReportByAgent);

// ==========================CLIENT ROUTES==========================
router
  .get("/my-reports", verifyToken, authorize(roles.CLIENT), reportController.getReportByClient)
  .get("/report/:id", verifyToken, authorize(roles.CLIENT), reportController.getReportById)
  .get("/property/:id", verifyToken, authorize(roles.CLIENT), reportController.getReportByProperty)
  .get("/agent/:id", verifyToken, authorize(roles.CLIENT), reportController.getReportByAgent);

// ==========================AGENT ROUTES==========================
router
  .post("/add", verifyToken, authorize(roles.AGENT), reportController.addReport)
  .delete("/delete/:id", verifyToken, authorize(roles.AGENT), reportController.deleteReport);
  

export default router;
