let inputFullName = document.querySelector('#profile-name')
let inputEmail = document.querySelector('#profile-email')
let inputBirthDate = document.querySelector('#profile-date')
let inputPhoneNumber = document.querySelector('#profile-phone')
let inputGender = document.querySelector('#profile-gender')
let defaultEmailErrorMessage = document.querySelector('#invalid-email').innerHTML

fetch('https://blog.kreosoft.space/api/account/profile', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    }
}).then((response) => {
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}).then((data) => {
    console.log(data)
    inputEmail.value = data.email
    inputFullName.value = data.fullName
    inputBirthDate.value = (data.birthDate != null) ? data.birthDate.substring(0,10) : ''
    inputPhoneNumber.value = data.phoneNumber
    inputGender.value = data.gender
})
    .catch((error) => {
        console.log(error)
    })

document.querySelector('#btn-profile-save').addEventListener('click', () =>{

    let model = new UserProfileModel()
    model.email = inputEmail.value
    model.fullName = inputFullName.value
    model.phoneNumber = (inputPhoneNumber.value.length === 0) ? undefined : inputPhoneNumber.value
    model.gender = inputGender.value
    model.birthDate = (inputBirthDate.value.length !== 0) ? new Date(inputBirthDate.value).toISOString() : undefined;

    inputFullName.classList.remove('is-invalid')
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

    fetch("https://blog.kreosoft.space/api/account/profile", {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(model)
    }).then((response) => {
        if (response.status === 400){
            document.querySelector('#profile-email').classList.add('is-invalid')
            document.querySelector('#invalid-email').innerHTML = 'Этот email уже используется'
            throw new Error('Error' + response.statusText)
        }
        window.location.href = '/'
    }).catch((error)=>{
        console.log(error)
    })
})