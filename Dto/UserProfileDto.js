import {AppValidator} from "../Scripts/Validators/AppValidator.js";

class UserProfileDto {
    fullName
    email
    birthDate
    gender
    phoneNumber
    
    constructor(fullName,email,birthDate,gender,phoneNumber) {
        this.fullName = fullName;
        this.email = email;
        this.birthDate = birthDate;
        this.gender = gender;
        this.phoneNumber = phoneNumber;

    }

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