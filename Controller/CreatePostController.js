import {CreatePostModel} from "../Model/CreatePostModel.js";
import {CreatePostView} from "../View/CreatePostView.js";
import {MAIN_PAGE} from "../Constants/dimens.js";

class CreatePostController {
    model
    view
    constructor() {
        this.model = new CreatePostModel()
        this.view = new CreatePostView()
    }


    async init(){

        const communities = await this.model.getAdminUsersCommunities()
        const tags = await this.model.getTags()

        this.view.renderTags(tags)
        this.view.renderCommunities(communities)

    }

    async createPost(){

        this.view.clearErrors()
        const data = this.view.getCreatePostData()

        const validateResult = this.model.validateCreatePostData(data)

        if (Object.values(validateResult).some(value => value === false)){
            this.view.showErrors(validateResult)
            console.log(data)
            console.log(validateResult)
            return
        }


        console.log(await this.model.sendNewPostData(data))
        window.location.href = MAIN_PAGE
    }
}

export {CreatePostController}