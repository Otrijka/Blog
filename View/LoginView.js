import {UserLoginDto} from "../Dto/UserLoginDto.js";

class LoginView {
    inputEmail = document.querySelector('#email')
    inputPassword = document.querySelector('#password')

    showErrors(validateResult){
        if (validateResult.email === false){
            this.inputEmail.classList.add('is-invalid')
        }
        if (validateResult.password === false){
            this.inputPassword.classList.add('is-invalid')
        }
    }

    clearErrors(){
        document.querySelector('#error-message').classList.add('d-none')
        this.inputEmail.classList.remove('is-invalid')
        this.inputPassword.classList.remove('is-invalid')
    }

    showServerError(){
        document.querySelector('#error-message').classList.remove('d-none')
    }

    getLoginData(){
        return new UserLoginDto(
            this.inputEmail.value,
            this.inputPassword.value
        )
    }
}

export {LoginView}