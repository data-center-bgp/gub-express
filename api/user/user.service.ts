import { PrismaService } from "../prisma.service";
import { EditUser } from "./user.interface";

export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUser() {
    const response = await this.prismaService.user.findMany();
    response.map((res) => {
      res.password = "";
    });
    return {
      code: 200,
      response: response,
    };
  }

  async getUserById(id: number) {
    const response = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });
    if (response) {
      response.password = "";
      return {
        code: 200,
        response: response,
      };
    }
    return {
      code: 403,
      response: "User is not found!",
    };
  }

  async getUserByUsername(username: string) {
    const response = await this.prismaService.user.findFirst({
      where: {
        username: username,
      },
    });
    if (response) {
      response.password = "";
      return {
        code: 200,
        response: response,
      };
    }
    return {
      code: 403,
      response: "User is not found!",
    };
  }

  async editUser(id: number, data: EditUser) {
    const isExist = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });
    if (isExist) {
      const updateUserData = {
        username: data.username || isExist.username,
        name: data.name || isExist.name,
        password: data.password || isExist.password,
      };
      const response = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: updateUserData,
      });
      response.password = "";
      if (response) {
        return {
          code: 400,
          response: "Bad request!",
        };
      }
      return {
        code: 404,
        response: "User not found!",
      };
    }
  }

  async deleteUser(id: number) {
    const response = await this.prismaService.user.delete({
        where: {
            id: id,
        },
    });
    return {
        code: 200,
        response: "User has been deleted!"
    };
  }
}
