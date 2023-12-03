import {CommunityInfoController} from "../Controller/CommunityInfoController.js";
import {GO_NEXT_PAGE, GO_PREVIOUS_PAGE} from "../Constants/dimens.js";

let communityInfoController = new CommunityInfoController()

await communityInfoController.init()


document.querySelector('#btn-apply').addEventListener('click', async () =>{
    await communityInfoController.useFilters()
})


document.querySelector('#btn-prev-page').addEventListener('click', async () =>{
    await communityInfoController.switchPage(GO_PREVIOUS_PAGE)
})
document.querySelector('#btn-next-page').addEventListener('click', async () =>{
    await communityInfoController.switchPage(GO_NEXT_PAGE)
})

document.querySelector('#filter-page-post-size').addEventListener('change',  async () =>{
    await communityInfoController.changePageSize()
})