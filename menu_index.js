import {MenuController} from "./Controller/MenuController.js";

let menuController = new MenuController()

await menuController.init()

document.querySelector('#btn-apply').addEventListener('click', async () =>{
    await menuController.useFilters()
})

document.querySelector('#btn-prev-page').addEventListener('click', async () =>{
    await menuController.previousPage()
})
document.querySelector('#btn-next-page').addEventListener('click', async () =>{
    await menuController.nextPage()
})


document.querySelector('#filter-page-post-size').addEventListener('change', async () =>{
    await menuController.useFilters()
})