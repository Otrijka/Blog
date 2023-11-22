import {AppValidator} from "../Scripts/Validators/AppValidator.js";

class UserProfileDto {
    fullName
    email
    birthDate
    gender
    phoneNumber

    IsValid() {
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