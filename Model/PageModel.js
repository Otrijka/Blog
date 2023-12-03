import {PROFILE, LOGOUT} from "../Constants/ApiUrls.js";
import {getToken} from "../Functions/functions.js";

class PageModel {
    token = getToken()

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