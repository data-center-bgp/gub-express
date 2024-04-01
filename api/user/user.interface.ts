export interface UserRegister {
    name: string;
    username: string;
    password: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface EditUser {
    name: string | undefined;
    username: string | undefined;
    password: string | undefined;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}

