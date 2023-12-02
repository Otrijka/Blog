import {LIKE_COLOR, POST_PAGE} from "../Constants/dimens.js";
import {checkToken, getToken, isImageValid, normalizeDateTime} from "../Functions/functions.js";

class PostInfoView {

    renderPostInfo(post) {
        document.querySelector('#post-template-author').textContent = post.author
        document.querySelector('#post-template-title').textContent = post.title
        document.querySelector('#post-template-title').style.cursor = 'pointer'
        document.querySelector('#post-template-title').addEventListener('click', () => {
            window.location.pathname = POST_PAGE + post.id
        })
        document.querySelector('#post-template-date').textContent = ' - ' + normalizeDateTime(post.createTime)
        document.querySelector('#post-template-title').setAttribute('data-id', post.id)

        if (post.hasLike) {
            document.querySelector("#post-template-like-icon").classList.add('bi-heart-fill')
            document.querySelector("#post-template-like-icon").style.color = LIKE_COLOR
        } else {
            document.querySelector("#post-template-like-icon").classList.add('bi-heart')
        }

        if (post.commentsCount > 0) {
            document.querySelector("#post-template-comments-icon").classList.add('bi-chat-left-fill')
        } else {
            document.querySelector("#post-template-comments-icon").classList.add('bi-chat-left')
        }

        document.querySelector('#post-template-likes-count').textContent = post.likes
        document.querySelector('#post-template-comments-count').textContent = post.commentsCount
        document.querySelector('#post-template-reading-time').textContent = 'Время чтения: ' + post.readingTime + ' мин.'
        document.querySelector('#post-template-community').textContent = (post.communityName != null) ? 'в сообществе ' + '"' + post.communityName + '"' : ''
        document.querySelector('#post-template-like-icon').addEventListener('click', async () => {
            if (await checkToken(getToken()) === undefined) {
                console.log('Denied like UnAuthorized')
                return
            }
            let method = (document.querySelector('#post-template-like-icon').classList.contains('bi-heart-fill')) ? 'DELETE' : 'POST'
            if (method === 'POST') {
                document.querySelector('#post-template-like-icon').classList.replace('bi-heart', 'bi-heart-fill')
                document.querySelector('#post-template-like-icon').style.color = LIKE_COLOR
                document.querySelector('#post-template-likes-count').textContent = parseInt(document.querySelector('#post-template-likes-count').textContent) + 1
                try {
                    const response = fetch(`https://blog.kreosoft.space/api/post/${document.querySelector('#post-template-title').getAttribute('data-id')}/like`, {
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
                document.querySelector('#post-template-like-icon').style.color = ''
                document.querySelector('#post-template-like-icon').classList.replace('bi-heart-fill', 'bi-heart')
                document.querySelector('#post-template-likes-count').textContent = parseInt(document.querySelector('#post-template-likes-count').textContent) - 1
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
                document.querySelector('#post-template-img').src = post.image
            }
        })

        post.tags.forEach(tag => {
            let newTag = document.createElement('span')
            newTag.textContent = '#' + tag.name + ' '
            document.querySelector('#post-template-tags').appendChild(newTag)
        })
    }
}

export {PostInfoView}