 export class AppValidator {


    NameIsValid(name) {
        return name.trim().length >= 1 && /[a-zA-Zа-яА-Я]/.test(name);
    }

    PasswordIsValid(password) {
        return password.length >= 6 && /\d/.test(password);
    }

    EmailIsValid(email) {
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(email)
    }

    BirthDateIsValid(birthDate){
        if (birthDate === undefined || birthDate.length === 0){
            return true
        }
        let currentDate = new Date().toISOString()
        return birthDate < currentDate
    }

    PhoneNumberIsValid(phoneNumber){
        if (phoneNumber === undefined || phoneNumber.length === 0){
            return true
        }
        let pattern = /^\+?7\d{3}\d{3}\d{2}\d{2}$/

        return pattern.test(phoneNumber)
    }

    GenderIsValid(gender){
        if (gender === undefined || gender.length === 0){
            return true;
        }
        return ['Male','Female'].includes(gender)
    }
}