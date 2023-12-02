import {POST_ID} from "../Constants/ApiUrls.js";
import {getPageHtml, getToken} from "../Functions/functions.js";

class PostInfoModel {

    async getPostInfo(postId){
        return await (await fetch(POST_ID + postId, {headers: {'Authorization': 'Bearer ' + getToken()}})).json()
    }

}

export {PostInfoModel}