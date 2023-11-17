document.querySelector('#btn-register').addEventListener('click', () => {
    let model = new UserRegisterModel()
    model.fullName = document.querySelector('#fullName').value
    model.password = document.querySelector('#password').value
    model.email = document.querySelector('#email').value
    model.birthDate = document.querySelector('#birthdate').value
    model.phoneNumber = document.querySelector('#phone').value
    model.gender = document.querySelector('#gender').value


    if (Object.values(model.IsValid()).some(value => value === false)) {

    } else {

    }

    console.log(model)
    console.log(model.IsValid())

})