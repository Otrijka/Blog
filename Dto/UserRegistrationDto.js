import {AppValidator} from "../Functions/AppValidator.js";

class UserRegistrationDto {
    fullName
    birthDate
    gender
    phoneNumber
    email
    password

    constructor(fullName,birthDate, gender, phoneNumber, email, password) {
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.phoneNumber = phoneNumber
        this.email = email
        this.password = password;
    }

    isValid() {
        let validator = new AppValidator()

        return {
            fullName: validator.NameIsValid(this.fullName),
            password: validator.PasswordIsValid(this.password),
            email: validator.EmailIsValid(this.email),
            birthDate: validator.BirthDateIsValid(this.birthDate),
            gender: validator.GenderIsValid(this.gender),
            phoneNumber: validator.PhoneNumberIsValid(this.phoneNumber)
        }
    }
}

export {UserRegistrationDto}