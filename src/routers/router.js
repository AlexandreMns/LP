import userRoutes from "./routes/userRouter.js";
import adminRoutes from "./routes/adminRouter.js";

export const routes = [
  { path: "/api/user", router: userRoutes },
  { path: "/api/admin", router: adminRoutes },
];
