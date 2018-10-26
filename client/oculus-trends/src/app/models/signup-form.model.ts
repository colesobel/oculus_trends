export interface SignupFormInterface{
    accountName: string, 
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string
}

export class SignupForm {
    accountName: string
    firstName: string
    lastName: string
    email: string
    password: string

    constructor(signupForm: SignupFormInterface) {
        this.accountName = signupForm.accountName
        this.firstName = signupForm.firstName
        this.lastName = signupForm.lastName
        this.email = signupForm.email
        this.password = signupForm.password
    }
}