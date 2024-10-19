import { HttpStatus } from "../utils/httpStatus.js";

export class ReportController {
  constructor(reportService) {
    this.reportService = reportService;
  }

  addReport = async (req, res) => {
    try {
      const data = {
        property: req.body.property,
        client: req.body.client,
        agent: req.user,
        description: req.body.description,
        saleValue: req.body.saleValue,
        saleDate: req.body.saleDate,
      };
      const response = await this.reportService.addReport(data);
      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  getReportById = async (req, res) => {
    try {
      const data = req.params.id;
      const response = await this.reportService.getReportById(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  getReportByProperty = async (req, res) => {
    try {
      const data = {
        user: req.user,
        id: req.query.id,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        search: req.query.search,
      };
      const response = await this.reportService.getReportByProperty(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  getReportByClient = async (req, res) => {
    try {
      const data = {
        user: req.user,
        id: req.query.id,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        search: req.query.search,
      };
      const response = await this.reportService.getReportByClient(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  getReportByAgent = async (req, res) => {
    try {
      const data = {
        user: req.user,
        id: req.query.id,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        search: req.query.search,
      };
      const response = await this.reportService.getReportByAgent(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  getMyReports = async (req, res) => {
    try {
      const data = {
        user: req.user,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        search: req.query.search,
      };
      const response = await this.reportService.getMyReports(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  deleteReport = async (req, res) => {
    try {
      const data = req.params.id;
      const response = await this.reportService.deleteReport(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
}

export default ReportController;
