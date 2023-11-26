import {CreatePostController} from "./Controller/CreatePostController.js";

let createPostController = new CreatePostController()

await createPostController.init()
document.querySelector('#create-post-btn-create').addEventListener('click', async () =>{
    await createPostController.createPost()

})

document.querySelector('#create-post-region').addEventListener('select2:select', async () =>{

})