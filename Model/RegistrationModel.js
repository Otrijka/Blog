import {REGISTER} from "../Constants/ApiUrls.js";

class RegistrationModel {

    async sendRegistrationData(data) {
        try {
            const response = await fetch(REGISTER, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                return response.status
            }
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    validateRegisterData(data){
        return data.isValid()
    }
}

export {RegistrationModel}