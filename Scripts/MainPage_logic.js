class Post {
    title = undefined
    description = undefined
    readingTime = undefined
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

class PageFilters {
    tags = undefined
    author = undefined
    min = undefined
    max = undefined
    sorting = undefined
    onlyMyCommunities = false
    page = 1
    size = 5

    BuildQuery() {
        let query = '?'
        const queryParts = []

        for (const key in this) {
            if (this[key] !== undefined && this[key] !== "") {
                const value = this[key]

                if (Array.isArray(value)) {
                    value.forEach(item => {
                        queryParts.push(`${key}=${item}`)
                    })
                } else {
                    queryParts.push(`${key}=${value}`)
                }
            }
        }
        query += queryParts.join('&')
        return query
    }
}

function getTags() {
    fetch('https://blog.kreosoft.space/api/tag', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let tagFilter = document.querySelector('#filter-tags')
            data.forEach(tag => {
                let newOption = document.createElement('option')
                newOption.text = tag.name
                newOption.value = tag.id
                tagFilter.add(newOption)
            })
        })
}

getTags()

function getPosts(query) {
    let postsList = []
    let url = 'https://blog.kreosoft.space/api/post'
    if (query != undefined && query !== null){
        url += query
    }
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            data.posts.forEach(post => {
                let newPost = new Post()
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
                postsList.push(newPost)
                drawPost(newPost)
            })
        })

    return postsList
}

function isImageValid(url, callback) {
    let img = new Image();
    img.onload = function () {
        callback(true);
    };
    img.onerror = function () {
        callback(false);
    };
    img.src = url;
}

function drawPost(post) {
    let postsContainer = document.querySelector('#posts-container')
    postsContainer.innerHTML = ''
    fetch('../Pages/Templates/PostTemplate.html')
        .then((response) => response.text())
        .then((template) => {
            let cardTemplate = document.createElement('div')
            cardTemplate.innerHTML = template.trim()
            cardTemplate.querySelector('#post-template-author').textContent = post.author
            cardTemplate.querySelector('#post-template-title').textContent = post.title
            cardTemplate.querySelector('#post-template-description').textContent = post.description
            cardTemplate.querySelector('#post-template-date').textContent = post.date
            cardTemplate.querySelector('#post-template-comments-count').textContent = post.commentsCount
            cardTemplate.querySelector('#post-template-likes-count').textContent = post.likes
            cardTemplate.querySelector('#post-template-reading-time').textContent = 'Время чтения: ' + post.readingTime + ' мин.'
            cardTemplate.querySelector('#post-template-community').textContent = (post.communityName != null) ? 'в сообществе ' + '"' + post.communityName + '"' : ''
            isImageValid(post.image, (isValid) => {
                if (isValid) {
                    cardTemplate.querySelector('#post-template-img').src = post.image
                   // console.log(post.title + ' Загружено: ' + post.image)
                } else {
                    //console.log(post.title + ' Загрузка провалена: ' + post.image)
                }
            })
            post.tags.forEach(tag => {
                let newTag = document.createElement('span')
                newTag.textContent = '#' + tag.name + ' '
                cardTemplate.querySelector('#post-template-tags').appendChild(newTag)
            })
            postsContainer.appendChild(cardTemplate)
        })
}


getPosts()

function getFiltersQuery(){
    filters = new PageFilters()
    filters.author = document.querySelector('#filter-author-name').value
    filters.tags = Array.from(document.querySelector('#filter-tags').selectedOptions).map(option => option.value)
    filters.min = document.querySelector('#filter-min-reading-time').value
    filters.max = document.querySelector('#filter-max-reading-time').value
    filters.sorting = document.querySelector('#filter-sorting-by').value
    filters.onlyMyCommunities = document.querySelector('#filter-own-group').checked
    return filters.BuildQuery()
}

document.querySelector('#btn-apply').addEventListener('click', () => {
    let newQuery = getFiltersQuery()
    window.history.pushState({}, '', window.location.pathname + newQuery)
    getPosts(newQuery)
})

window.onload = () => {
    window.history.pushState({}, '', window.location.origin)
}


