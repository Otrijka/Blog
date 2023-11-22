export function getToken(){
    return localStorage.getItem('jwtToken')
}

export function setToken(token){
    return localStorage.setItem('jwtToken', token)
}

export function removeToken(){
    return localStorage.removeItem('jwtToken')
}

export async function getPageHtml(pageName){
    try {
        const response = await fetch(`../Pages/${pageName}.html`)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${response.status}`)
        }
        return await response.text()
    } catch (error) {
        console.error(error)
    }
}