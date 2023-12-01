import {COMMUNITY, COMMUNITY_ID, TAG} from "../Constants/ApiUrls.js";
import {checkToken, getPageHtml, getToken} from "../Functions/functions.js";
import {CURRENT_PAGE_SIZE, SUBSCRIBE, UN_SUBSCRIBE} from "../Constants/dimens.js";

class CommunityInfoModel {
    currentPageSize = CURRENT_PAGE_SIZE
    currentPage = 1
    currentPageCount

    async getTags() {
        return await (await fetch(TAG)).json()
    }

    async getAdminTemplate() {
        return await getPageHtml('/Templates/AdminTemplate')
    }

    async getPostTemplate() {
        return await getPageHtml('/Templates/PostTemplate')
    }

    async getUserRole(id) {
        return (await checkToken(getToken())) ? await (await fetch(COMMUNITY_ID + id + '/role', {headers: {'Authorization': 'Bearer ' + getToken()}})).json() : null
    }

    getFiltersValuesFromQuery(query) {
        return {
            tags: query.getAll('tags'),
            sorting: query.get('sorting'),
            size: query.get('size')
        }
    }

    async getCommunityInfo(id) {
        let info = await (await fetch(COMMUNITY_ID + id)).json()
        info.userRole = await this.getUserRole(id)
        return info
    }

    async getCommunityPosts(id, query) {
        let url
        if (query === undefined || '') {
            url = COMMUNITY_ID + id + '/post'
        } else {
            url = COMMUNITY_ID + id + '/post?' + query
        }
        const response = await fetch(url, {headers: {'Authorization': 'Bearer ' + getToken()}})
        if (!response.ok) {
            return false
        }
        const data = await response.json()
        this.currentPageCount = data.pagination.count
        this.currentPage = data.pagination.current
        this.currentPageSize = data.pagination.size
        console.log(data)
        return data
    }


    async doBtnAction(actionType, communityId) {
        if (await checkToken(getToken(), true)) {
            if (actionType === SUBSCRIBE) {
                window.location.reload()
                await fetch(`${COMMUNITY}/${communityId}/subscribe`, {
                    method: 'POST',
                    headers: {'Authorization': 'Bearer ' + getToken()}
                })
                return true
            }
            if (actionType === UN_SUBSCRIBE) {
                await fetch(`${COMMUNITY}/${communityId}/unsubscribe`, {
                    method: 'DELETE',
                    headers: {'Authorization': 'Bearer ' + getToken()}
                })
                window.location.reload()
                return true
            }
            return false
        }
    }


}

export {CommunityInfoModel}