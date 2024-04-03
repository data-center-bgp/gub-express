import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { PrismaService } from "../prisma.service";
import { UserAuth } from "./user.auth.service";
import { UserService } from "./user.service";
import { ChangePassword, EditUser } from "./user.interface";
import { UserGuard } from "./user.guard";

const prismaService = new PrismaService();
const userAuth = new UserAuth(prismaService);
const userService = new UserService(prismaService);
const userGuard = new UserGuard();
const userRouter = express.Router();

const authenticationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = String(
            req.headers["authorization"]?.split(" ")[1].replace("'", "")
        )
        const checkToken = userGuard.authentication(token);
        if (checkToken) {
            req.id = checkToken.id;
            next();
        } else {
            res.status(401).send("Unauthorized!");
        }
    } catch (err) {
        req.id = 0;
        res.status(500).json("Error authenticating!");
    }
}

const authorizationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = String(
            req.headers["authorization"]?.split(" ")[1].replace("'", "")
        )
        const id = Number(req.params.id);
        const checkAuthorization = userGuard.authorization(id, token);
        if (checkAuthorization) {
            next();
        } else {
            res.status(401).send("Unauthorized!");
        }
    } catch (err) {
        res.status(500).json("Error authenticating!");
    }
}

// REGISTER USER
userRouter.post("/register", async (req: Request, res: Response) => {
    try {
        const response = await userAuth.register(req.body);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN USER
userRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const response = await userAuth.login(req.body);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL USERS
userRouter.get("/users", authenticationMiddleware, async (req: Request, res: Response) => {
    try {
        const response = await userService.getAllUser();
        res.status(response.code).json(response.response);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER BY ID
userRouter.get("/user/:id", authenticationMiddleware, authorizationMiddleware, async (req: Request, res: Response) => {
    try {
        const response = await userService.getUserById(Number(req.params.id));
        res.status(response.code).json(response.response);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER BY USERNAME
userRouter.get("/user/:username", authenticationMiddleware, async (req: Request, res: Response) => {
    try {
        const response = await userService.getUserByUsername(String(req.params.username));
        res.status(response.code).json(response.response);
    } catch (err) {
        res.status(500).json(err);
    }
});

// EDIT USER
userRouter.patch("/user/:id", authenticationMiddleware, authorizationMiddleware, async (req: Request, res: Response) => {
    try {
        const response = await userService.editUser(Number(req.params.id), req.body);
        if (response) {
            res.status(response.code).json(response.response);
        } else {
            throw new Error("User is not found!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

userRouter.delete("/user/:id", authenticationMiddleware, authorizationMiddleware, async (req: Request, res: Response) => {
    try {
        const response = await userService.deleteUser(Number(req.params.id));
        if (response) {
            res.status(response.code).json(response.response);
        } else {
            throw new Error("User is not found!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

userRouter.patch("/user/change-password/:id", authenticationMiddleware, authorizationMiddleware, async (req: Request, res: Response) => {
    try {
        const response = await userAuth.changePassword(Number(req.params.id), req.body as ChangePassword);
        if (response) {
            res.status(response.code).json(response.response);
        } else {
            throw new Error("User is not found!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

export { userRouter };