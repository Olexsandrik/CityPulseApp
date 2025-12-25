import PATHS from "@src/common/constants/PATHS";

import { Router } from "express";
import { sendN8NDataController } from "../../controllers/sendN8NData/sendN8NDataController";
import UserRoutes from "./UserRoutes";

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ** Add UserRouter ** //

// Init router
const userRouter = Router();

// Get all users
userRouter.get(PATHS.Users.Get, UserRoutes.getAll);
userRouter.post(PATHS.Users.Add, UserRoutes.add);
userRouter.put(PATHS.Users.Update, UserRoutes.update);
userRouter.delete(PATHS.Users.Delete, UserRoutes.delete);
userRouter.post("/send-n8n-data", sendN8NDataController.sendN8NData);
// Add UserRouter
apiRouter.use("/users", userRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
