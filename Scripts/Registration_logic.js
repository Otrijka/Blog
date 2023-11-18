let inputFullName = document.querySelector('#fullName')
let inputPassword = document.querySelector('#password')
let inputEmail = document.querySelector('#email')
let inputBirthDate = document.querySelector('#birthdate')
let inputPhoneNumber = document.querySelector('#phone')
let inputGender = document.querySelector('#gender')
let defaultEmailErrorMessage = document.querySelector('#invalid-email').innerHTML
document.querySelector('#btn-register').addEventListener('click', () => {

    let model = new UserRegisterModel()
    model.fullName = inputFullName.value
    model.password = inputPassword.value
    model.email = inputEmail.value
    model.birthDate = (inputBirthDate.value.length !== 0) ? new Date(inputBirthDate.value).toISOString() : undefined;
    model.phoneNumber = (inputPhoneNumber.value.length === 0) ? undefined : inputPhoneNumber.value
    model.gender = inputGender.value

    console.log(model)
    inputFullName.classList.remove('is-invalid')
    inputPassword.classList.remove('is-invalid')
    inputEmail.classList.remove('is-invalid')
    document.querySelector('#invalid-email').innerHTML = defaultEmailErrorMessage
    inputBirthDate.classList.remove('is-invalid')
    inputPhoneNumber.classList.remove('is-invalid')
    inputGender.classList.remove('is-invalid')
    
    let validateResult = model.IsValid()
    if (Object.values(validateResult).some(value => value === false)) {
        if (validateResult.fullName === false) {
            inputFullName.classList.add('is-invalid')
        }
        if (validateResult.password === false) {
            inputPassword.classList.add('is-invalid')
        }
        if (validateResult.email === false) {
            inputEmail.classList.add('is-invalid')
        }
        if (validateResult.birthDate === false) {
            inputBirthDate.classList.add('is-invalid')
        }
        if (validateResult.phoneNumber === false) {
            inputPhoneNumber.classList.add('is-invalid')
        }
        if (validateResult.gender === false) {
            inputGender.classList.add('is-invalid')
        }
        return
    }

    fetch("https://blog.kreosoft.space/api/account/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(model)
    }).then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (Object.keys(data)[0] === 'DuplicateUserName'){
                document.querySelector('#email').classList.add('is-invalid')
                document.querySelector('#invalid-email').innerHTML = 'Этот email уже используется'
            }
        })

})