import {PROFILE, LOGOUT} from "../Constants/ApiUrls.js";

class PageModel {
    token = localStorage.getItem('jwtToken')

    async getPageHtml(pageName) {
        try {
            const response = await fetch(`../Pages/${pageName}.html`)
            if (!response.ok) {
                throw new Error(`Failed to fetch ${this.url}, status: ${response.status}`)
            }
            const html = await response.text()
            return html
        } catch (error) {
            console.error(error)
        }
    }

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
            const data = await response.json()
            console.log(data)
            localStorage.removeItem('jwtToken')
        } catch (error) {
            console.error(error)
        }
    }
}

export {PageModel}