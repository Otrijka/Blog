import {PostInfoView} from "../View/PostInfoView.js";
import {PostInfoModel} from "../Model/PostInfoModel.js";
import {checkToken, getToken} from "../Functions/functions.js";

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
        const addressChain = await this.model.getAddressChain(postData.addressId)
        console.log(postData)

        this.view.renderAddress(addressChain)
        this.view.renderPostInfo(postData)

        const commentTemplates = await this.model.getCommentSubCommentTemplate()
        this.view.renderComments(postData.id, commentTemplates.commentTemplate, commentTemplates.subCommentTemplate,  postData.comments, await checkToken(getToken()))
    }


}

export {PostInfoController}