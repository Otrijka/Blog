import {UserProfileDto} from "../Dto/UserProfileDto.js";

class ProfileView {

    inputFullName = document.querySelector('#profile-name')
    inputEmail = document.querySelector('#profile-email')
    inputBirthDate = document.querySelector('#profile-date')
    inputPhoneNumber = document.querySelector('#profile-phone')
    inputGender = document.querySelector('#profile-gender')
    defaultEmailErrorMessage = document.querySelector('#invalid-email').innerHTML

    renderProfile(userProfileData) {
        this.inputEmail.value = userProfileData.email
        this.inputFullName.value = userProfileData.fullName
        this.inputBirthDate.value = (userProfileData.birthDate != null) ? userProfileData.birthDate.substring(0, 10) : ''
        this.inputPhoneNumber.value = userProfileData.phoneNumber
        this.inputGender.value = userProfileData.gender

    }

    getNewProfileData(){
        let model = new UserProfileDto()
        model.email = this.inputEmail.value
        model.fullName = this.inputFullName.value
        model.phoneNumber = (this.inputPhoneNumber.value.length === 0) ? undefined : this.inputPhoneNumber.value
        model.gender = this.inputGender.value
        model.birthDate = (this.inputBirthDate.value.length !== 0) ? new Date(this.inputBirthDate.value).toISOString() : undefined;
        return model
    }

    clearErrors() {
        this.inputFullName.classList.remove('is-invalid')
        this.inputEmail.classList.remove('is-invalid')
        document.querySelector('#invalid-email').innerHTML = this.defaultEmailErrorMessage
        this.inputBirthDate.classList.remove('is-invalid')
        this.inputPhoneNumber.classList.remove('is-invalid')
        this.inputGender.classList.remove('is-invalid')
    }

    showErrors(validateResult) {
        if (validateResult.fullName === false) {
            this.inputFullName.classList.add('is-invalid')
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

    showUsedEmail() {
        document.querySelector('#profile-email').classList.add('is-invalid')
        document.querySelector('#invalid-email').innerHTML = 'Этот email уже используется'
    }

}

export {ProfileView}