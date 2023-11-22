export function getToken(){
    return localStorage.getItem('jwtToken')
}

export async function getPageHtml(pageName){
    try {
        const response = await fetch(`../Pages/${pageName}.html`)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${response.status}`)
        }
        const html = await response.text()
        return html
    } catch (error) {
        console.error(error)
    }
}