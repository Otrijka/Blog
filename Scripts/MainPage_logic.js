class Post {
    title = undefined
    description = undefined
    readindTime = undefined
    image = undefined
    authorId = undefined
    author = undefined
    communityId = undefined
    communityName = undefined
    addressId = undefined
    likes = undefined
    hasLike = undefined
    commentsCount = undefined
    tags = []
}

class PageFilters{
    tags = undefined
    author = undefined
    min = undefined
    max = undefined
    sorting = undefined
    onlyMyCommunities = false
    page = 1
    size = 5

    BuildQuery(){
        let query = '?'
        const queryParts = []
        for (const key in this){
            if (this[key] !== undefined){
                const value = this[key]
                queryParts.push(`${key}=${value}`)
            }
        }
        query = queryParts.join('$')
        return query
    }
}


function getPostList(){


}