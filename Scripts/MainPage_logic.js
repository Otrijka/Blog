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
document.querySelector('#btn-apply').addEventListener('click', () => {
    filters = new PageFilters()
    filters.author = document.querySelector('#filter-author-name').value
    filters.tags = Array.from(document.querySelector('#filter-tags').selectedOptions).map(option => option.value)
    filters.min = document.querySelector('#filter-min-reading-time').value
    filters.max = document.querySelector('#filter-max-reading-time').value
    filters.sorting = document.querySelector('#filter-sorting-by').value
    filters.onlyMyCommunities = document.querySelector('#filter-own-group').checked

    let newQuery = filters.BuildQuery()
    window.history.pushState({}, '', window.location.pathname + newQuery)
})

window.onload = () =>{
    window.history.pushState({},'',window.location.origin)
}


