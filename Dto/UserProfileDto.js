import {AppValidator} from "../Functions/AppValidator.js";

class UserProfileDto {
    email
    fullName
    phoneNumber
    gender
    birthDate

    constructor(email,fullName,phoneNumber,gender,birthDate) {
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.birthDate = birthDate;

    }

    isValid() {
        let validator = new AppValidator()

        return {
            fullName: validator.NameIsValid(this.fullName),
            email: validator.EmailIsValid(this.email),
            birthDate: validator.BirthDateIsValid(this.birthDate),
            gender: validator.GenderIsValid(this.gender),
            phoneNumber: validator.PhoneNumberIsValid(this.phoneNumber)
        }
    }
}

export {UserProfileDto}