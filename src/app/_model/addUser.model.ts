export class NewUser{
    role: String;
    email: String;
    username: String;
    password: String;
    cpassword: String;
    token: String;
}

export class ResetPassWord{
    id: Number;
    password: String;
    cpassword: String;
    token: String;
}