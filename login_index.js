import {LoginController} from "./Controller/LoginController.js";
import {REGISTRATION_PAGE} from "./Constants/LocalUrls.js";

let loginController = new LoginController()

document.querySelector('#btn-login').addEventListener('click', async () =>{
    await loginController.login()

})

document.querySelector('#btn-go-register').addEventListener('click', () =>{
    window.location.href = REGISTRATION_PAGE
})
