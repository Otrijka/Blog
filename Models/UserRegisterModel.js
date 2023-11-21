class UserRegisterModel {
    fullName
    password
    email
    birthDate
    gender
    phoneNumber

    IsValid() {
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