
class PageView {
    contentPlace

    constructor() {
        this.contentPlace = document.querySelector('#content-place')
    }

    renderPage(html, userEmail) {
        this.contentPlace.innerHTML = html

        this.contentPlace.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        })

        const dropdown = document.querySelector('#dropdown-header')
        const btnDropdown = document.querySelector('#btn-dropdown-header')
        const btnLogin = document.querySelector('#btn-login-header')
        const communities = document.querySelector('#btn-communities-header')
        if (userEmail === undefined) {
            dropdown.classList.add('d-none')
            communities.classList.add('d-none')
            btnLogin.classList.remove('d-none')
        } else {
            btnLogin.classList.add('d-none')
            communities.classList.remove('d-none')
            btnDropdown.innerHTML = userEmail
            dropdown.classList.remove('d-none')
        }
    }
}

export {PageView}