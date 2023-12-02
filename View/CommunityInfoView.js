import {
    ADMIN, CREATE_POST_PAGE, CURRENT_PAGE_SIZE,
    LIKE_COLOR,
    MALE,
    MAN,
    MAX_LETTERS_ON_DESCRIPTION, POST_PAGE,
    SUB,
    SUBSCRIBE,
    UN_SUBSCRIBE,
    WOMAN
} from "../Constants/dimens.js";
import {checkToken, getToken, isImageValid, normalizeDateTime} from "../Functions/functions.js";

class CommunityInfoView {


    getFiltersValues(page = 1) {
        let tags = Array.from(document.querySelector('#filter-tags').selectedOptions).map(option => option.value)
        return {
            tags: tags.length > 0 ? tags : '',
            sorting: document.querySelector('#filter-sorting-by').value,
            size: document.querySelector('#filter-page-post-size').value,
            page: page,
        }
    }

    renderTags(tags) {
        let tagFilter = document.querySelector('#filter-tags')
        tags.forEach(tag => {
            let newOption = document.createElement('option')
            newOption.text = tag.name
            newOption.value = tag.id
            tagFilter.add(newOption)
        })
    }

    renderFiltersValues(params) {
        params.tags.forEach(tagId => {
            const option = document.querySelector('#filter-tags').querySelector(`option[value="${tagId}"]`)
            if (option) {
                option.selected = true
            }
        })
        document.querySelector('#filter-sorting-by').value = params.sorting
        document.querySelector('#filter-page-post-size').value = (params.size !== null) ? params.size : CURRENT_PAGE_SIZE
    }

    renderInfo(adminTemplate, info, communityId, callback) {
        let adminsHolder = document.querySelector('#communityInfo-admins-holder')
        let admins = info.administrators
        admins.forEach(admin => {
            let adminFragment = document.createDocumentFragment();
            let adminContainer = document.createElement('div')
            adminContainer.innerHTML = adminTemplate.trim()
            adminContainer.querySelector('#admin-template-image').src = (admin.gender === MALE) ? MAN : WOMAN
            adminContainer.querySelector('#admin-template-name').src = admin.fullName

            while (adminContainer.firstChild) {
                adminFragment.appendChild(adminContainer.firstChild);
            }

            adminsHolder.appendChild(adminFragment)
        })
        document.querySelector('#communityInfo-name').innerText = info.name
        document.querySelector('#communityInfo-description').innerText = info.description
        document.querySelector('#communityInfo-subs-counter').innerText = info.subscribersCount + ' подписчиков'
        document.querySelector('#communityInfo-private-status').innerText = (info.isClosed === true) ? "Тип сообщества: закрытое" : "Тип сообщества: открытое"

        let btnSub = document.querySelector('#communityInfo-btn-sub-unsub')
        let btnWritePost = document.querySelector('#communityInfo-btn-write-post')

        switch (info.userRole) {
            case ADMIN:
                btnSub.classList.add('d-none')
                btnWritePost.classList.remove('d-none')
                break
            case SUB:
                btnSub.innerText = 'Отписаться'
                btnSub.classList.add('btn-danger')
                break
            default:
                btnSub.innerText = 'Подписаться'
                btnSub.classList.add('btn-primary')
                break
        }

        btnSub.addEventListener('click', async () => {
            if (btnSub.innerText === 'Подписаться') {
                if (await callback(SUBSCRIBE, info.id)) {
                    btnSub.innerText = 'Отписаться'
                    btnSub.classList.replace('btn-primary', 'btn-danger')
                }
            } else {
                if (await callback(UN_SUBSCRIBE, info.id)) {
                    btnSub.innerText = 'Подписаться'
                    btnSub.classList.replace('btn-danger', 'btn-primary')
                }

            }
        })

        btnWritePost.addEventListener('click', () => {
            window.location.href = CREATE_POST_PAGE + "?communityId=" + communityId
        })

    }

    renderPosts(template,posts){
        let postsContainer = document.querySelector('#posts-container')
        postsContainer.innerHTML = ''

        posts.posts.forEach(post => {
            let cardTemplate = document.createElement('div')
            cardTemplate.innerHTML = template.trim()
            cardTemplate.querySelector('#post-template-author').textContent = post.author
            cardTemplate.querySelector('#post-template-title').textContent = post.title
            cardTemplate.querySelector('#post-template-title').style.cursor = 'pointer'
            cardTemplate.querySelector('#post-template-title').addEventListener('click', () => {
                window.location.pathname = POST_PAGE + post.id
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

            normalizeDescription(post.description)

            function normalizeDescription(text) {
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

            cardTemplate.querySelector('#post-template-likes-count').textContent = post.likes
            cardTemplate.querySelector('#post-template-comments-count').textContent = post.commentsCount
            cardTemplate.querySelector('#post-template-reading-time').textContent = 'Время чтения: ' + post.readingTime + ' мин.'
            cardTemplate.querySelector('#post-template-community').textContent = (post.communityName != null) ? 'в сообществе ' + '"' + post.communityName + '"' : ''
            cardTemplate.querySelector('#post-template-like-icon').addEventListener('click', async () => {
                if (await checkToken(getToken()) === undefined) {
                    console.log('Denied like UnAuthorized')
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
            postsContainer.appendChild(cardTemplate)
        })
    }


    checkAndDisableBtn(currentPage, pageCount) {
        document.querySelector('#btn-next-page').disabled = false
        document.querySelector('#btn-prev-page').disabled = false

        if (currentPage === 1) {
            document.querySelector('#btn-prev-page').disabled = true
        }
        if (currentPage === pageCount) {
            document.querySelector('#btn-next-page').disabled = true
        }
    }
}

export {CommunityInfoView}