import {PROFILE} from "../Constants/ApiUrls.js";
import {getToken} from "../Functions/functions.js";
import {UserProfileDto} from "../Dto/UserProfileDto.js";

class ProfileModel {
    token = getToken()

    async getUserProfileData() {
        try {
            const response = await fetch(PROFILE, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
            if (!response.ok) {
                throw new Error(`Failed to fetch ${response.status}`)
            }
            const data = await response.json()
            let model = new UserProfileDto()
            model.fullName = data.fullName
            model.phoneNumber = data.phoneNumber
            model.email = data.email
            model.gender = data.gender
            model.birthDate = data.birthDate
            return model
        } catch (error) {
            console.error(error)
        }
    }

    async updateUserProfileData(newModel) {
        try {
            const response = await fetch(PROFILE, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${this.token}`
                },
                body: JSON.stringify(newModel)
            })
            if (!response.ok) {
                return response.status
                throw new Error(`Failed to fetch ${response.status}`)
            }
        } catch (error) {
            console.error(error)
        }
    }

    validateNewData(newModel) {
        return newModel.IsValid()
    }


}

export {ProfileModel}