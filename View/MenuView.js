import {CURRENT_PAGE_SIZE, LIKE_COLOR, MAX_LETTERS_ON_DESCRIPTION, POST_PAGE} from "../Constants/dimens.js";
import {checkToken, getToken, isImageValid, normalizeDateTime} from "../Functions/functions.js";
import {POST} from "../Constants/ApiUrls.js";

class MenuView {

    postsContainer = document.querySelector('#posts-container')

    renderTags(tags) {
        let tagFilter = document.querySelector('#filter-tags')
        tags.forEach(tag => {
            let newOption = document.createElement('option')
            newOption.text = tag.name
            newOption.value = tag.id
            tagFilter.add(newOption)
        })
    }

    renderPagination(currentPage, pageCount){
        let container = document.querySelector('.pagination')

        container.innerHTML = ""
        container.innerHTML += `<li class="page-item">
                            <button class="page-link ${currentPage === 1 ? 'disabled' : ''}" id="btn-prev-page">
                                <i class="bi bi-chevron-double-left"></i>
                            </button>
                        </li>`

        for (let page = Math.max(1, currentPage - 2); page <= Math.min(pageCount, currentPage + 2); page++) {
            container.innerHTML += `
        <li class="page-item number ${page === currentPage ? 'active' : ''}">
          <button class="page-link" onclick="">${page}</button>
        </li>
      `;
        }

        container.innerHTML += `<li class="page-item">
                            <button class="page-link ${currentPage === pageCount ? 'disabled' : ''}" id="btn-next-page" aria-label="Следующая">
                                <i class="bi bi-chevron-double-right"></i>
                            </button>
                        </li>`
    }

    renderPosts(template, posts) {
        this.postsContainer.innerHTML = ''
        posts.forEach(post => {
            let cardTemplate = document.createElement('div')
            cardTemplate.innerHTML = template.trim()
            cardTemplate.querySelector('#post-template-author').textContent = post.author
            cardTemplate.querySelector('#post-template-title').textContent = post.title
            cardTemplate.querySelector('#post-template-title').style.cursor = 'pointer'
            cardTemplate.querySelector('#post-template-title').addEventListener('click', () => {
                window.location.href = POST_PAGE + post.id
            })
            cardTemplate.querySelector('#post-template-date').textContent = ' - ' + normalizeDateTime(post.createTime)
            cardTemplate.querySelector('#post-template-title').setAttribute('data-id', post.id)

            if (post.hasLike) {
                cardTemplate.querySelector("#post-template-like-icon").classList.add('bi-heart-fill')
                cardTemplate.querySelector("#post-template-like-icon").style.color = LIKE_COLOR
            } else {
                cardTemplate.querySelector("#post-template-like-icon").classList.add('bi-heart')
            }

            if (post.commentsCount > 0) {
                cardTemplate.querySelector("#post-template-comments-icon").classList.add('bi-chat-left-fill')
            } else {
                cardTemplate.querySelector("#post-template-comments-icon").classList.add('bi-chat-left')
            }

            normalizeDescription(cardTemplate, post)
            cardTemplate.querySelector('#post-template-likes-count').textContent = post.likes
            cardTemplate.querySelector('#post-template-comments-count').textContent = post.commentsCount
            cardTemplate.querySelector('#post-template-reading-time').textContent = 'Время чтения: ' + post.readingTime + ' мин.'
            cardTemplate.querySelector('#post-template-community').textContent = (post.communityName != null) ? 'в сообществе ' + '"' + post.communityName + '"' : ''
            cardTemplate.querySelector('#post-template-like-icon').style.cursor = (getToken() !== null) ? "pointer" : "default"
            cardTemplate.querySelector('#post-template-like-icon').addEventListener('click', async () => {
                if (getToken() === null) {
                    return
                }
                let method = (cardTemplate.querySelector('#post-template-like-icon').classList.contains('bi-heart-fill')) ? 'DELETE' : 'POST'
                if (method === 'POST') {
                    cardTemplate.querySelector('#post-template-like-icon').classList.replace('bi-heart', 'bi-heart-fill')
                    cardTemplate.querySelector('#post-template-like-icon').style.color = LIKE_COLOR
                    cardTemplate.querySelector('#post-template-likes-count').textContent = parseInt(cardTemplate.querySelector('#post-template-likes-count').textContent) + 1
                    try {
                        const response = fetch(`https://blog.kreosoft.space/api/post/${cardTemplate.querySelector('#post-template-title').getAttribute('data-id')}/like`, {
                            method: method,
                            headers: {
                                'Content-type': 'application/json',
                                'Authorization': 'Bearer ' + getToken()
                            }
                        })
                    } catch (error) {
                        console.error(error)
                    }
                } else {
                    cardTemplate.querySelector('#post-template-like-icon').style.color = ''
                    cardTemplate.querySelector('#post-template-like-icon').classList.replace('bi-heart-fill', 'bi-heart')
                    cardTemplate.querySelector('#post-template-likes-count').textContent = parseInt(cardTemplate.querySelector('#post-template-likes-count').textContent) - 1
                    try {
                        const response = fetch(`https://blog.kreosoft.space/api/post/${cardTemplate.querySelector('#post-template-title').getAttribute('data-id')}/like`, {
                            method: method,
                            headers: {
                                'Content-type': 'application/json',
                                'Authorization': 'Bearer ' + getToken()
                            }
                        })
                    } catch (error) {
                        console.error(error)
                    }
                }
            })


            isImageValid(post.image, (isValid) => {
                if (isValid) {
                    cardTemplate.querySelector('#post-template-img').src = post.image
                }
            })

            post.tags.forEach(tag => {
                let newTag = document.createElement('span')
                newTag.textContent = '#' + tag.name + ' '
                cardTemplate.querySelector('#post-template-tags').appendChild(newTag)
            })
            this.postsContainer.appendChild(cardTemplate)
        })


    }

    getFiltersValues(page = 1) {
        let tags = Array.from(document.querySelector('#filter-tags').selectedOptions).map(option => option.value)
        return {
            author: document.querySelector('#filter-author-name').value.trim(),
            tags: tags.length > 0 ? tags : '',
            min: document.querySelector('#filter-min-reading-time').value,
            max: document.querySelector('#filter-max-reading-time').value,
            sorting: document.querySelector('#filter-sorting-by').value,
            onlyMyCommunities: (document.querySelector('#filter-own-group').checked === true) ? true : "",
            size: document.querySelector('#filter-page-post-size').value,
            page: page,
        }
    }

    renderBtnNewPost(token) {
        if (token === null) {
            document.querySelector('#btn-new-post').classList.add('d-none')
        } else {
            document.querySelector('#btn-new-post').classList.remove('d-none')
            document.querySelector('#btn-new-post').classList.add('d-sm-block')
        }
    }

    renderFiltersValues(params) {
        params.tags.forEach(tagId => {
            const option = document.querySelector('#filter-tags').querySelector(`option[value="${tagId}"]`)
            if (option) {
                option.selected = true
            }
        })
        document.querySelector('#filter-author-name').value = params.author
        document.querySelector('#filter-min-reading-time').value = params.min
        document.querySelector('#filter-max-reading-time').value = params.max
        document.querySelector('#filter-sorting-by').value = params.sorting
        document.querySelector('#filter-own-group').checked = params.onlyMyCommunities
        document.querySelector('#filter-page-post-size').value = (params.size !== null) ? params.size : CURRENT_PAGE_SIZE
    }


}


function normalizeDescription(cardTemplate, post) {
    let descriptionHolder = cardTemplate.querySelector('#post-template-description')
    let showedLetters = 0
    let words = post.description.replace(/\n/g, ' <br> ').split(' ')
    let iterator = 0;
    if (words.length === 1 && words[0].length > MAX_LETTERS_ON_DESCRIPTION) {
        let newWords = []
        newWords.push(words[0].substring(0, MAX_LETTERS_ON_DESCRIPTION))
        newWords.push(words[0].substring(MAX_LETTERS_ON_DESCRIPTION, words[0].length - 1))
        descriptionHolder.innerHTML = newWords[0]
        let readMoreBtn = document.createElement('button')
        readMoreBtn.classList.add('btn')
        readMoreBtn.classList.add('btn-link')
        readMoreBtn.textContent = 'Читать далее'
        readMoreBtn.style.display = 'block'
        descriptionHolder.appendChild(readMoreBtn)
        readMoreBtn.onclick = () => {
            descriptionHolder.removeChild(readMoreBtn)
            descriptionHolder.innerHTML += newWords[1]
        }
    } else {
        while (showedLetters < MAX_LETTERS_ON_DESCRIPTION && iterator < words.length) {
            descriptionHolder.innerHTML += words[iterator] + ' '
            showedLetters += words[iterator].length
            iterator++
            if (showedLetters > MAX_LETTERS_ON_DESCRIPTION && iterator < words.length) {

                let readMoreBtn = document.createElement('button')
                readMoreBtn.classList.add('btn')
                readMoreBtn.classList.add('btn-link')
                readMoreBtn.textContent = 'Читать далее'
                readMoreBtn.style.display = 'block'
                descriptionHolder.appendChild(readMoreBtn)
                readMoreBtn.onclick = () => {
                    descriptionHolder.removeChild(readMoreBtn)
                    while (iterator < words.length) {
                        descriptionHolder.innerHTML += words[iterator] + ' '
                        iterator++
                    }
                }
            }

        }
    }
}

export {MenuView}