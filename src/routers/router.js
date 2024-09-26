import userRoutes from "./routes/userRouter.js";
import adminRoutes from "./routes/adminRouter.js";

export const routes = [
  { path: "/api/users", router: userRoutes },
  { path: "/api/admins", router: adminRoutes },
];