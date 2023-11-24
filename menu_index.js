import {MenuController} from "./Controller/MenuController.js";
import {smoothScrollToTop} from "./Functions/functions.js";
import {GO_NEXT_PAGE, GO_PREVIOUS_PAGE} from "./Constants/dimens.js";

let menuController = new MenuController()

await menuController.init()

document.querySelector('#btn-apply').addEventListener('click', async () =>{
    await menuController.useFilters()
})

document.querySelector('#btn-prev-page').addEventListener('click', async () =>{
    await menuController.switchPage(GO_PREVIOUS_PAGE)
})
document.querySelector('#btn-next-page').addEventListener('click', async () =>{
    await menuController.switchPage(GO_NEXT_PAGE)
})


document.querySelector('#filter-page-post-size').addEventListener('change',  async () =>{
    await menuController.changePageSize()
})