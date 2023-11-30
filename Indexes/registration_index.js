import {RegistrationController} from "../Controller/RegistrationController.js";

let registrationController = new RegistrationController()

document.querySelector('#btn-register').addEventListener('click', async () =>{
    await registrationController.register()
})