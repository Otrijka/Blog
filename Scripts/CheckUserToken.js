function checkUserToken() {
    const token = localStorage.getItem('jwtToken')
    const dropdown = document.querySelector('#dropdown-header')
    const btnLogin = document.querySelector('#btn-login-header')
    if (token !== undefined) {
        fetch('https://blog.kreosoft.space/api/account/profile', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (!response.ok) {
                dropdown.classList.add('d-none')
                btnLogin.classList.remove('d-none')
                throw new Error('\n\t-> ' + response.status + '\n\t-> ' + response.statusText);
            }
            return response.json()

        }).then((data) => {
            let userEmail = data.email
            document.querySelector('#btn-dropdown-header').innerHTML = userEmail
            dropdown.classList.remove('d-none')
            btnLogin.classList.add('d-none')
        }).catch((error) => {
            console.log(error)
        })
    }
}

checkUserToken()
