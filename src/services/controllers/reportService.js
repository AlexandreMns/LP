import { Property } from "../../models/propertyModel.js";
import { User } from "../../models/usersModel.js";
import { Report } from "../../models/reportModel.js";
import { reportPagination } from "../../utils/dataUtil.js";

export class ReportService {
  async addReport(data) {
    try {
      const property = await Property.findById(data.property);
      if (!property) return "Property not found";

      const client = await User.findById(data.client);
      if (!client) return "Client not found";

      const report = new Report(data);
      await report.save();
      return report;
    } catch (error) {
      throw new Error("Error during report registration: " + error.message);
    }
  }

  async getReportById(data) {
    try {
      const report = await this.findReportById(data);
      if (!report) {
        return "Report not found";
      }
      return report;
    } catch (error) {
      throw new Error("Error fetching report: " + error.message);
    }
  }

  async findReportById(data) {
    try {
      return await Report.findById(data);
    } catch (error) {
      throw new Error("Error fetching report: " + error.message);
    }
  }

  /* Nao esta a ser usado
  async getReportsByField(field, id) {
    try {
      const user = await User.findById(id);
      if (!user) return "User not found";

      const reports = await Report.find({ [field]: id });
      if (reports.length === 0) return "No reports found";
      return reports;
    } catch (error) {
      throw new Error(
        "Error fetching reports by " + field + ": " + error.message
      );
    }
  }
    */

  async getReportByProperty(data) {
    try {
      const property = await Property.findById(data);
      if (!property) {
        return "Property not found";
      }
      return await this.getReportsByField("property", data);
    } catch (error) {
      throw new Error("Error fetching reports by property: " + error.message);
    }
  }

  async getReportByClient(data) {
    try {
      const client = await User.findById(data);
      console.log(data);
      if (!client) {
        return "Client not found";
      }
      return await this.getReportsByField("client", data);
    } catch (error) {
      throw new Error("Error fetching reports by client: " + error.message);
    }
  }

  async getReportByAgent(data) {
    try {
      const agent = await User.findById(data);
      if (!agent) {
        return "Agent not found";
      }
      return await this.getReportsByField("agent", data);
    } catch (error) {
      throw new Error("Error fetching reports by client: " + error.message);
    }
  }

  async getMyReports(data) {
    try {
      const user = await User.findById(data.user);
      if (!user) {
        return "User not found";
      }
      return await reportPagination(data);
    } catch (error) {
      throw new Error("Error fetching reports: " + error.message);
    }
  }

  async getAllReports() {
    try {
      const reports = await Report.find();
      if (reports.length === 0) return "No reports found";
      return reports;
    } catch (error) {
      throw new Error("Error fetching reports: " + error.message);
    }
  }

  /* Nao esta a ser usado
  async updateReport(data) {
    try {
      const report = await Report.findByIdAndUpdate(data.reportId, data, {
        new: true,
      });
      if (!report) return "Report not found";
      return report;
    } catch (error) {
      throw new Error("Error updating report: " + error.message);
    }
  }
    */

  async deleteReport(id) {
    try {
      const result = await Report.deleteOne({ _id: id });
      if (result.deletedCount === 0) throw new Error("Report not found");
      return "Report deleted successfully";
    } catch (error) {
      throw new Error("Error deleting report: " + error.message);
    }
  }

  async getReports(data) {
    try {
      const options = {
        skip: (data.page - 1) * data.limit,
        limit: parseInt(data.limit),
      };
      const reports = await Report.find({}, null, options);
      const total = await Report.countDocuments({});
      const payload = {
        reports,
        total,
        page: parseInt(data.page),
        pages: Math.ceil(total / data.limit),
      };
      return payload;
    } catch (error) {
      throw new Error("Error fetching reports: " + error.message);
    }
  }
}

export default new ReportService();
