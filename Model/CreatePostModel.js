import {COMMUNITY_ID, COMMUNITY_MY, POST, TAG} from "../Constants/ApiUrls.js";
import {getToken} from "../Functions/functions.js";
import {ADMIN} from "../Constants/dimens.js";

class CreatePostModel {
    async getAdminUsersCommunities() {
        let userCommunities = []
        try {
            const response = await fetch(COMMUNITY_MY, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }

            })
            const data = await response.json()
            data.forEach(community => {
                if (community.role === ADMIN) {
                    userCommunities.push(community.communityId)
                }
            })
        } catch (error) {
            console.error(error)
        }
        let requiredCommunities = []

        await Promise.all(userCommunities.map(async communityId => {
            try {
                const response = await fetch(COMMUNITY_ID + communityId, {
                    method: 'GET',
                });

                const data = await response.json();

                requiredCommunities.push({
                    communityId: data.id,
                    name: data.name,
                });
            } catch (error) {
                console.error(error);
            }
        }));
        return requiredCommunities
    }

    async getTags() {
        try {
            const response = await fetch(TAG)
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    getCommunityValueFromQuery(query) {
        return query.get('communityId')
    }


    async sendNewPostData(data) {
        let url
        if (data.communityId === undefined) {
            url = POST
        } else {
            url = COMMUNITY_ID + data.communityId + '/post'
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(data)
            })
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    validateCreatePostData(data) {
        return data.isValid()
    }
}

export {CreatePostModel}