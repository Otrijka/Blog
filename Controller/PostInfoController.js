import {PostInfoView} from "../View/PostInfoView.js";
import {PostInfoModel} from "../Model/PostInfoModel.js";

class PostInfoController {
    model
    view
    postId

    constructor() {
        this.model = new PostInfoModel()
        this.view = new PostInfoView()
        this.postId = window.location.pathname.split('/')[2]
    }


    async init(){

        const postData = await this.model.getPostInfo(this.postId)
        console.log(postData)

        this.view.renderPostInfo(postData)

    }
}

export {PostInfoController}