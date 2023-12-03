import {checkToken, getPageHtml, getToken} from "../Functions/functions.js";
import {COMMUNITY, COMMUNITY_MY} from "../Constants/ApiUrls.js";
import {SUBSCRIBE, UN_SUBSCRIBE} from "../Constants/dimens.js";

class CommunitiesModel {

    async getCommunityTemplate() {
        return await getPageHtml('/Templates/CommunityTemplate')
    }

    async getCommunities() {
        try {
            let communities = await (await fetch(COMMUNITY)).json()

            if (await checkToken(getToken())) {
                let userRoles = await (await fetch(COMMUNITY_MY, {headers: {'Authorization': 'Bearer ' + getToken()}})).json()

                const userRolesMap = userRoles.reduce((acc, userRole) => {
                    acc[userRole.communityId] = userRole
                    return acc
                }, {})
                return communities.map(community => {
                    const userRole = userRolesMap[community.id];
                    return {
                        ...community,
                        userRole: userRole ? userRole.role : null
                    };
                })
            }

            return communities.map(community => ({...community, userRole: null}))

        } catch (error) {
            console.error(error)
        }
    }

    async doBtnAction(actionType, communityId) {
        if (await checkToken(getToken(), true)) {
            if (actionType === SUBSCRIBE) {
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
                return true
            }
            return false
        }
    }
}

export {CommunitiesModel}