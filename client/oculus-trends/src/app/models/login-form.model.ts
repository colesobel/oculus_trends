export interface LoginFormInterface {
    email: string, 
    password: string
}

export class LoginForm {
    email: string
    password: string

    constructor(loginForm: LoginFormInterface) {
        this.email = loginForm.email
        this.password = loginForm.password
    }
}
