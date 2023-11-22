import {UserRegistrationDto} from "../Dto/UserRegistrationDto.js";

class RegistrationView {
    inputFullName = document.querySelector('#fullName')
    inputPassword = document.querySelector('#password')
    inputEmail = document.querySelector('#email')
    inputBirthDate = document.querySelector('#birthdate')
    inputPhoneNumber = document.querySelector('#phone')
    inputGender = document.querySelector('#gender')
    defaultEmailErrorMessage = document.querySelector('#invalid-email').innerHTML

    getRegistrationData(){
        return new UserRegistrationDto(
            this.inputFullName.value,
            (this.inputBirthDate.value.length !== 0) ? new Date(this.inputBirthDate.value).toISOString() : undefined,
            this.inputGender.value,
            (this.inputPhoneNumber.value.length === 0) ? undefined : this.inputPhoneNumber.value,
            this.inputEmail.value,
            this.inputPassword.value,
        )
    }

    showErrors(validateResult){
        if (validateResult.fullName === false) {
            this.inputFullName.classList.add('is-invalid')
        }
        if (validateResult.password === false) {
            this.inputPassword.classList.add('is-invalid')
        }
        if (validateResult.email === false) {
            this.inputEmail.classList.add('is-invalid')
        }
        if (validateResult.birthDate === false) {
            this.inputBirthDate.classList.add('is-invalid')
        }
        if (validateResult.phoneNumber === false) {
            this.inputPhoneNumber.classList.add('is-invalid')
        }
        if (validateResult.gender === false) {
            this.inputGender.classList.add('is-invalid')
        }
    }

    clearErrors(){
        this.inputFullName.classList.remove('is-invalid')
        this.inputPassword.classList.remove('is-invalid')
        this.inputEmail.classList.remove('is-invalid')
        document.querySelector('#invalid-email').innerHTML = this.defaultEmailErrorMessage
        this.inputBirthDate.classList.remove('is-invalid')
        this.inputPhoneNumber.classList.remove('is-invalid')
        this.inputGender.classList.remove('is-invalid')
    }

    showServerError(){
        document.querySelector('#email').classList.add('is-invalid')
        document.querySelector('#invalid-email').innerHTML = 'Этот email уже используется'
    }
}

export {RegistrationView}