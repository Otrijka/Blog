import {LOGIN} from "../Constants/ApiUrls.js";

class LoginModel {

    async sendLoginData(data){
        try{
            const response = await fetch(LOGIN, {
                method: 'POST',
                headers:{
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if (!response.ok){
                return response.status
            }
            return await response.json()
        }catch (error){
            console.error(error)
        }
    }

    validateLoginData(data){
        return data.isValid()
    }
}

export {LoginModel}