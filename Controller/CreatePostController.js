import {CreatePostModel} from "../Model/CreatePostModel.js";
import {CreatePostView} from "../View/CreatePostView.js";
import {MAIN_PAGE} from "../Constants/dimens.js";
import {addAddressSelect, checkToken, getPageHtml, getToken, smoothScrollToBottom} from "../Functions/functions.js";

class CreatePostController {
    model
    view
    query

    currentAddressLevel = 1
    addressInfo = [{
        id: 0,
        guid: '',
        text: "Страна"
    }]

    constructor() {
        this.model = new CreatePostModel()
        this.view = new CreatePostView()
        this.query = new URLSearchParams(window.location.search)
    }


    async init() {
        await checkToken(getToken(),true)
        const communities = await this.model.getAdminUsersCommunities()
        const tags = await this.model.getTags()
        this.view.renderTags(tags)
        await this.view.renderCommunities(communities)
        this.view.renderCommunityValue(this.model.getCommunityValueFromQuery(this.query))

        await addAddressSelect(0, this.currentAddressLevel, this.addressInfo)
    }

    async createPost() {

        this.view.clearErrors()
        let data = this.view.getCreatePostData()

        if (this.addressInfo.length > 1 && this.addressInfo[1].guid !== '') {
            let latestAddressIndex = this.addressInfo.length - 1
            while (this.addressInfo[latestAddressIndex].guid === '') {
                latestAddressIndex -= 1
            }
            data.addressId = this.addressInfo[latestAddressIndex].guid
        }

        const validateResult = this.model.validateCreatePostData(data)

        if (Object.values(validateResult).some(value => value === false)) {
            this.view.showErrors(validateResult)
            return
        }


        await this.model.sendNewPostData(data)
        window.location.href = MAIN_PAGE
    }
}


export {CreatePostController}