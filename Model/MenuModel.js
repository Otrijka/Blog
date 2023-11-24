import {POST, TAG} from "../Constants/ApiUrls.js";
import {PostDto} from "../Dto/PostDto.js";
import {getPageHtml} from "../Functions/functions.js";
import {CURRENT_PAGE_SIZE, POST_TEMPLATE} from "../Constants/dimens.js";

class MenuModel {
    currentPageSize = CURRENT_PAGE_SIZE
    currentPage = 1
    currentPageCount

    async getTags() {
        try {
            const response = await fetch(TAG)
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    getFiltersValuesFromQuery(query){
        return{
            tags: query.getAll('tags'),
            author : query.get('author'),
            min: query.get('min'),
            max:query.get('max'),
            sorting:query.get('sorting'),
            onlyMyCommunities: (query.get('onlyMyCommunities') === 'true') ,
        }
    }
    async getPosts(query) {
        try {
            console.log(query)
            let postList = []
            let url = POST
            if (undefined !== query) {
                url += "?" + query
            }

            const response = await fetch(url)
            const data = await response.json()
            console.log(data.pagination)
            this.currentPageCount = data.pagination.count
            this.currentPage = data.pagination.current

            data.posts.forEach(post =>{
                let newPost = new PostDto()
                newPost.title = post.title
                newPost.description = post.description
                newPost.readingTime = post.readingTime
                newPost.image = post.image
                newPost.authorId = post.authorId
                newPost.author = post.author
                newPost.communityId = post.communityId
                newPost.communityName = post.communityName
                newPost.addressId = post.addressId
                newPost.likes = post.likes
                newPost.hasLike = post.hasLike
                newPost.commentsCount = post.commentsCount
                newPost.tags = post.tags
                postList.push(newPost)
            })
            return postList

        } catch (error) {
            console.error(error)
        }


    }

    async getPostTemplate(){
         return await getPageHtml(POST_TEMPLATE)
    }
}

export {MenuModel}