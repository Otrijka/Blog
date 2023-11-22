import {RegistrationModel} from "../Model/RegistrationModel.js";
import {RegistrationView} from "../View/RegistrationView.js";
import {setToken} from "../Functions/functions.js";
import {MAIN_PAGE} from "../Constants/dimens.js";

class RegistrationController {
    model
    view

    constructor() {
        this.model = new RegistrationModel()
        this.view = new RegistrationView()
    }

    async register() {
        this.view.clearErrors()
        const registerData = this.view.getRegistrationData()
        const validateResult = this.model.validateRegisterData(registerData)
        if (Object.values(validateResult).some(value => value === false)) {
            this.view.showErrors(validateResult)
        } else {
            const response = await this.model.sendRegistrationData(registerData)
            if (response === 400) {
                this.view.showServerError()
            } else {
                const token = response.token
                setToken(token)
                window.location.href = MAIN_PAGE
            }
        }
    }
}

export {RegistrationController}