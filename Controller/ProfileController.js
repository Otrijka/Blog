import {ProfileView} from "../View/ProfileView.js";
import {ProfileModel} from "../Model/ProfileModel.js";
import {MAIN_PAGE} from "../Constants/dimens.js";

class ProfileController {
    model
    view

    constructor() {
        this.view = new ProfileView()
        this.model = new ProfileModel()
    }

    async init() {
        let data = await this.model.getUserProfileData()
        this.view.renderProfile(data)
    }

    async UpdateUserProfile() {
        try {
            this.view.clearErrors()
            const newData = this.view.getNewProfileData()
            const validateResult = this.model.validateNewData(newData)

            if (Object.values(validateResult).some(value => value === false)) {
                this.view.showErrors(validateResult)
                throw new Error(`Invalid data ${validateResult}`)
            }else{
                let response = await this.model.sendUserProfileData(newData)
                if (response === 400){
                    return this.view.showUsedEmail()
                }
                window.location.href = MAIN_PAGE
            }
        }catch (error){
            console.error(error)
        }


    }
}

export {ProfileController}