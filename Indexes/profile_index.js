import {ProfileController} from "../Controller/ProfileController.js";


let profileController = new ProfileController()

await profileController.init()

document.querySelector('#btn-profile-save').addEventListener('click', async () =>{
    await profileController.UpdateUserProfile()
})