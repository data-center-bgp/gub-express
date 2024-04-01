import { PrismaService } from "../prisma.service";
import { UserRegister, UserLogin, ChangePassword } from "./user.interface";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserAuth {
    constructor(private readonly prismaService: PrismaService) {}

    async register(data: UserRegister) {
        const isExist = await this.prismaService.user.findFirst({
            where: {
                username: data.username,
            },
        });
        if (isExist) {
            return {
                code: 409,
                response: "User is already registered!",
            };
        }
        const response = await this.prismaService.user.create({
            data: {
                ...data,
                password: bcrypt.hashSync(
                    data.password,
                    Number(process.env["HASH_SALT"])
                ),
            },
        });
        response.password = "";
        if (response) {
            return {
                code: 201,
                response: response,
            };
        }
        return {
            code: 400,
            response: "Bad request!",
        };
    }

    async login(data: UserLogin) {
        const response = await this.prismaService.user.findFirst({
            where: {
                username: data.username,
            },
        });
        if (response) {
            const isPasswordMatch = bcrypt.compareSync(
                data.password,
                response.password
            );
            if (!isPasswordMatch) {
                return {
                    code: 401,
                    response: "Unauthorized!",
                };
            }
            const payload = {
                id: response.id,
                username: response.username,
                name: response.name,
            }
            const token = jwt.sign(payload, String(process.env["JWT_SECRET"]), {
                expiresIn: "1h",
                algorithm: "HS256",
                });
            const returnValue = {
                id: response.id,
                access_token: token,
                username: response.username,
                name: response.name,
            };
            return {
                code: 200,
                response: returnValue,
            };
        }
        return {
            code: 404,
            response: "User not found!",
        }
    }

    async changePassword(id: number, data: ChangePassword) {
        const isExist = await this.prismaService.user.findFirst({
            where: {
                id: id,
            },
        });
        if (!isExist) {
            return {
                code: 404,
                response: "User not found!",
            };
        }
        const passwordCheck = bcrypt.compareSync(
            data.oldPassword,
            isExist.password
        );
        if (!passwordCheck) {
            return {
                code: 403,
                response: "Invalid password!",
            };
        }
        const response = await this.prismaService.user.update({
            where: {
                id: id,
            },
            data: {
                password: bcrypt.hashSync(
                    data.newPassword,
                    Number(process.env["HASH_SALT"])
                ),
            },
        });
        return {
            code: 201,
            response: response,
        };
    }
}