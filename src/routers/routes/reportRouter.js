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
router.get(
  "/my-reports/",
  verifyToken,
  authorize(roles.CLIENT),
  reportController.getMyReports
  //funcao que faz ver os reports atravaez do token do cliente
);

router.get(
  "/report/:id",
  verifyToken,
  authorize(roles.CLIENT),
  reportController.getReportById
  //caso tenha um report com esse id ele consegue ver o report
);

router.get(
  "/property/:id",
  verifyToken,
  authorize(roles.CLIENT),
  reportController.getReportByProperty
  //fazer com que ele consege ver os reports atraves da propriedade se tiver algum report com essa propriedade
);

router.get(
  "/agent/:id",
  verifyToken,
  authorize(roles.CLIENT),
  reportController.getReportByAgent
  //fazer com que ele consege ver os reports atraves do agente se tiver algum report com esse agente
);

// ==========================AGENT ROUTES==========================
router.post(
  "/add",
  verifyToken,
  authorize(roles.AGENT),
  reportController.addReport
);

//Nao sei ate que ponto um agente pode eliminar os reports
router.delete(
  "/delete/:id",
  verifyToken,
  authorize(roles.AGENT),
  reportController.deleteReport
);

export default router;
