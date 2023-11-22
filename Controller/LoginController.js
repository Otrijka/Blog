import {LoginModel} from "../Model/LoginModel.js";
import {LoginView} from "../View/LoginView.js";
import {setToken} from "../Functions/functions.js";
import {MAIN_PAGE} from "../Constants/LocalUrls.js";

class LoginController {
    model
    view

    constructor() {
        this.model = new LoginModel()
        this.view = new LoginView()
    }

    async login() {
        this.view.clearErrors()
        const loginData = this.view.getLoginData()
        const validateResult = this.model.validateLoginData(loginData)
        if (Object.values(validateResult).some(value => value === false)) {
            this.view.showErrors(validateResult)
        } else {
            const response = await this.model.sendLoginData(loginData)
            if (response === 400) {
                this.view.showServerError()
            }
            else if(response === 500){
                console.log('InternalServerError')
                }
             else {
                const token = response.token
                setToken(token)
                window.location.href = MAIN_PAGE
            }
        }


    }
}

export {LoginController}