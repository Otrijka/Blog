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
            return new UserProfileDto(
                data.email,
                data.fullName,
                data.phoneNumber,
                data.gender,
                data.birthDate,
            )
        } catch (error) {
            console.error(error)
        }
    }

    async sendUserProfileData(data) {
        try {
            const response = await fetch(PROFILE, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                return response.status
                throw new Error(`Failed to fetch ${response.status}`)
            }
        } catch (error) {
            console.error(error)
        }
    }

    validateNewData(data) {
        return data.IsValid()
    }


}

export {ProfileModel}