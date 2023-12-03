import {ADDRESS_CHAIN, COMMENT, POST_ID} from "../Constants/ApiUrls.js";
import {getPageHtml, getToken} from "../Functions/functions.js";
import {COMMENT_TEMPLATE, SUB_COMMENT_TEMPLATE} from "../Constants/dimens.js";

class PostInfoModel {

    async getPostInfo(postId) {
        let postInfo = await (await fetch(POST_ID + postId, {headers: {'Authorization': 'Bearer ' + getToken()}})).json()
        for (let comment of postInfo.comments) {
            comment.subComments = await (await fetch(COMMENT + comment.id + '/tree', {headers: {'Authorization': 'Bearer ' + getToken()}})).json()
        }
        return postInfo
    }

    async getSubComments(commentId) {
        return (await fetch(COMMENT + commentId + '/tree', {headers: {'Authorization': 'Bearer ' + getToken()}})).json()
    }

    async getAddressChain(addressId) {
        if (addressId === null) {
            return []
        }
        return (await fetch(ADDRESS_CHAIN + `?objectGuid=${addressId}`, {headers: {'Authorization': 'Bearer ' + getToken()}})).json()
    }

    async getCommentSubCommentTemplate() {
        return {
            commentTemplate: await getPageHtml(COMMENT_TEMPLATE),
            subCommentTemplate: await getPageHtml(SUB_COMMENT_TEMPLATE)
        }
    }



}

export {PostInfoModel}