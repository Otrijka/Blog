import {AppValidator} from "../Scripts/Validators/AppValidator.js";

export class UserLoginModel {
    email
    password

    IsValid() {
        let validator = new AppValidator()

        return {
            email: validator.EmailIsValid(this.email)
        }


    }
}