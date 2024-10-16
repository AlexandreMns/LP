import userRoutes from "./routes/userRouter.js";
import adminRoutes from "./routes/adminRouter.js";
import agentRoutes from "./routes/agentRouter.js";
import propertyRoutes from "./routes/propertyRouter.js";
import wishlistRoutes from "./routes/wishlistRouter.js";
import reportRoutes from "./routes/reportRouter.js";

export const routes = [
  { path: "/api/users", router: userRoutes },
  { path: "/api/admins", router: adminRoutes },
  { path: "/api/agents", router: agentRoutes },
  { path: "/api/properties", router: propertyRoutes },
  { path: "/api/wishlist", router: wishlistRoutes },
  { path: "/api/reports", router: reportRoutes },
];
