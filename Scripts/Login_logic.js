let inputEmail = document.querySelector('#email')
let inputPassword = document.querySelector('#password')

document.querySelector('#btn-login').addEventListener('click', () => {

    document.querySelector('#error-message').classList.add('d-none')
    inputEmail.classList.remove('is-invalid')
    inputPassword.classList.remove('is-invalid')

    let model = new UserLoginModel()
    model.email = inputEmail.value
    model.password = inputPassword.value

    if (!model.IsValid().email) {
        inputEmail.classList.add('is-invalid')
        return
    }

    if (inputPassword.value === '') {
        inputPassword.classList.add('is-invalid')
        return
    }

    fetch("https://blog.kreosoft.space/api/account/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(model)
    }).then((response) => {
        if (response.status === 400) {
            document.querySelector('#error-message').classList.remove('d-none')
            return
        }
        return response.json()
    })
        .then((data) => {
            window.localStorage.setItem('jwtToken', data.token)
            window.location.href = '/'
        })

})