import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { ReportService } from "../../services/controllers/reportService.js";
import ReportController from "../../controllers/reportController.js";
import authorize from "../../middlewares/authorize.js";
import { roles } from "../../models/usersModel.js";

const router = express.Router();
const reportService = new ReportService();
const reportController = new ReportController(reportService);

// ==========================CLIENT ROUTES==========================

//Get my reports
router.get(
  "/my-reports/",
  verifyToken,
  authorize(roles.CLIENT),
  reportController.getMyReports
);

// ==========================AGENT ROUTES==========================

//Create a report
router.post(
  "/add",
  verifyToken,
  authorize(roles.AGENT),
  reportController.addReport
);

// ==========================ADMIN ROUTES==========================

//Delete a report
router.delete(
  "/delete/:id",
  verifyToken,
  authorize(roles.ADMIN),
  reportController.deleteReport
);

//Get report via id
router.get(
  "/report/:id",
  verifyToken,
  authorize(roles.ADMIN),
  reportController.getReportById
);

//Get report via property id
router.get(
  "/property/",
  verifyToken,
  authorize(roles.ADMIN),
  reportController.getReportByProperty
  //fazer com que ele consege ver os reports atraves da propriedade se tiver algum report com essa propriedade
);

//Get report via agent id
router.get(
  "/agent/",
  verifyToken,
  authorize(roles.ADMIN),
  reportController.getReportByAgent
  //fazer com que ele consege ver os reports atraves do agente se tiver algum report com esse agente
);

export default router;
