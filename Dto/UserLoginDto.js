import {AppValidator} from "../Functions/AppValidator.js";

class UserLoginDto {
    email
    password

    constructor(email, password) {
        this.email = email
        this.password = password
    }

    isValid(){
        let validator = new AppValidator()
        return {
            email: validator.EmailIsValid(this.email),
            password: this.password.length > 0
        }
    }
}

export {UserLoginDto}