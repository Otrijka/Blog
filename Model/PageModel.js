import {PROFILE, LOGOUT} from "../Constants/ApiUrls.js";
import {getToken} from "../Functions/functions.js";

class PageModel {
    token = getToken()
    async checkToken() {
        try {
            const response = await fetch(PROFILE, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
            if (!response.ok) {
                throw new Error(`Failed to fetch ${response.status}`)
            }
            const userProfile = await response.json()
            return userProfile.email
        } catch (error) {
            console.error(error)
        }
    }

    async logoutUser() {
        try {
            const response = await fetch(LOGOUT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
            if (!response.ok) {
                throw new Error(`Failed to fetch ${response.status}`)
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export {PageModel}