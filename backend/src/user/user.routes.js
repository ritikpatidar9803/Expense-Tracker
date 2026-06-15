import {Router} from "express"
import { updateStatus,createUser, login,logout, sendEmail, forgotPassword, verifyToken, changePassword, getAllUsers } from "./user.controller.js"
import { AdminGuard, AdminUserGuard, VerifyTokenGuard } from "../middleware/guard.middleware.js";


const userRouter = Router()

//  @POST   /api/user/signup
userRouter.post('/signup', createUser);

//  @POST   /api/user/login
userRouter.post('/login', login);

// @POST /api/user/send-mail
userRouter.post('/send-mail', sendEmail);

//@POST /api/user/forgot-password
userRouter.post('/forgot-password', forgotPassword);

//@POST /api/user/verify-token
userRouter.post('/verify-token', VerifyTokenGuard,verifyToken);

//@PUT change password
userRouter.put('/change-password', VerifyTokenGuard,changePassword);

// @GET /api/user/session
userRouter.get('/session', AdminUserGuard,(req,res)=>{
    return res.json(req.user);
});

// @GET /api/user/logout
userRouter.get('/logout', logout);


// @GET /api/user/user
userRouter.get('/get',AdminGuard, getAllUsers);

// @GET /api/user/status
userRouter.put('/status/:id',AdminGuard, updateStatus);



export default userRouter;