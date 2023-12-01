import {COMMUNITY, COMMUNITY_ID, TAG} from "../Constants/ApiUrls.js";
import {checkToken, getPageHtml, getToken} from "../Functions/functions.js";
import {SUBSCRIBE, UN_SUBSCRIBE} from "../Constants/dimens.js";

class CommunityInfoModel {


    async getTags() {
        return await (await fetch(TAG)).json()
    }

    async getAdminTemplate() {
        return await getPageHtml('/Templates/AdminTemplate')
    }

    async getUserRole(id) {
        return await (await fetch(COMMUNITY_ID + id + '/role', {headers: {'Authorization': 'Bearer ' + getToken()}})).json()
    }

    async getCommunityInfo(id) {
        return await (await fetch(COMMUNITY_ID + id)).json()
    }

    async doBtnAction(actionType, communityId) {
        if (actionType === SUBSCRIBE) {
            await fetch(`${COMMUNITY}/${communityId}/subscribe`, {
                method: 'POST',
                headers: {'Authorization': 'Bearer ' + getToken()}
            })
        }
        if (actionType === UN_SUBSCRIBE) {
            await fetch(`${COMMUNITY}/${communityId}/unsubscribe`, {
                method: 'DELETE',
                headers: {'Authorization': 'Bearer ' + getToken()}
            })
        }
    }
}

export {CommunityInfoModel}