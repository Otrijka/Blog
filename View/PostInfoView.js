import {LIKE_COLOR, LOGIN_PAGE, POST_PAGE} from "../Constants/dimens.js";
import {checkToken, getToken, isImageValid, normalizeDateTime} from "../Functions/functions.js";
import {COMMENT, POST_ID} from "../Constants/ApiUrls.js";

class PostInfoView {

    isRefactoring = false
    post

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
        document.querySelector('#post-template-description').innerHTML = post.description.replace(/\n/g, ' <br> ')
        document.querySelector('#post-template-reading-time').textContent = 'Время чтения: ' + post.readingTime + ' мин.'
        document.querySelector('#post-template-community').textContent = (post.communityName != null) ? 'в сообществе ' + '"' + post.communityName + '"' : ''
        document.querySelector('#post-template-like-icon').style.cursor = (getToken() !== null) ? "pointer" : "default"
        document.querySelector('#post-template-like-icon').addEventListener('click', async () => {
            if (getToken() === null) {
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

        document.querySelector('#post-info-btn-send-comment').addEventListener('click', async () => {
            const text = document.querySelector('#post-info-comment-textarea').value
            await this.sendComment(post.id, text)
        })
    }

    renderAddress(addressChain) {
        if (addressChain.length === 0) {
            document.querySelector('#post-template-address-icon').classList.add('d-none')
        }
        addressChain.forEach((address, index) => {
            let suffix = (index === addressChain.length - 1) ? "" : ", "
            address.text = (address.objectLevel === "Building") ? `д ${address.text}` : address.text
            let text = (address.text.replace(' ', '. '))
            document.querySelector('#post-template-address').innerHTML += text + suffix
        })
    }

    renderComments(postId, commentTemplate, subCommentTemplate, rootComments, checkResponse = {id: "", email: ""}) {
        console.log(checkResponse)
        rootComments.forEach(comment => {
            let commentContainer = this.initComment(comment, commentTemplate, checkResponse, postId)

            commentContainer.querySelector('#post-info-comment-btn-open-sub-comments').addEventListener('click', () => {
                commentContainer.querySelector('#post-info-comment-btn-open-sub-comments').classList.add('d-none')
                commentContainer.querySelector('#post-info-subComments-holder').classList.remove('d-none')
                commentContainer.querySelector('#post-info-comment-btn-hide-sub-comments').classList.remove('d-none')
            })

            commentContainer.querySelector('#post-info-comment-btn-hide-sub-comments').addEventListener('click', () => {
                commentContainer.querySelector('#post-info-comment-btn-open-sub-comments').classList.remove('d-none')
                commentContainer.querySelector('#post-info-subComments-holder').classList.add('d-none')
                commentContainer.querySelector('#post-info-comment-btn-hide-sub-comments').classList.add('d-none')
                commentContainer.querySelector('#post-info-comment-author-name').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            })


            if (comment.subComments.length === 0) {
                commentContainer.querySelector('#post-info-comment-btn-open-sub-comments').classList.add('d-none')
                commentContainer.querySelector('#post-info-subComments-holder').classList.add('d-none')
            } else {
                comment.subComments.forEach(subComment => {

                    let subCommentContainer = this.initComment(subComment, subCommentTemplate, checkResponse, postId)
                    commentContainer.querySelector('#post-info-subComments-holder').appendChild(subCommentContainer)
                })
            }


            document.querySelector('#post-info-comments-container').appendChild(commentContainer)


        })


    }

    initComment(comment, commentTemplate, checkResponse, postId) {
        let commentContainer = document.createElement('div')
        commentContainer.innerHTML = commentTemplate.trim()

        commentContainer.querySelector('#post-info-comment-author-name').innerHTML = comment.author
        commentContainer.querySelector('#post-info-comment-text').innerHTML = comment.content
        commentContainer.querySelector('#post-info-comment-date').innerHTML = normalizeDateTime(comment.createTime)

        if (comment.modifiedDate !== null && comment.deleteDate === null) {
            commentContainer.querySelector('#post-info-comment-rewrite-status').classList.remove('d-none')
            commentContainer.querySelector('#post-info-comment-rewrite-status').title = normalizeDateTime(comment.modifiedDate)
        }

        if (comment.deleteDate !== null) {
            commentContainer.querySelector('#post-info-comment-text').innerText = "[Комментарий удалён]"
            commentContainer.querySelector('#post-info-comment-author-name').innerText = "[Комментарий удалён]"
            commentContainer.querySelector('#post-info-comment-text').title = normalizeDateTime(comment.deleteDate)
        }
        if (comment.authorId === checkResponse.id && comment.deleteDate === null) {
            commentContainer.querySelector('#post-info-comment-pencil-icon').classList.remove('d-none')
            commentContainer.querySelector('#post-info-comment-trash-icon').classList.remove('d-none')
        }

        commentContainer.querySelector('#post-info-comment-trash-icon').addEventListener('click', async () => {
            await fetch(COMMENT + comment.id, {
                method: 'DELETE',
                headers: {'Authorization': 'Bearer ' + getToken()}
            })
            window.location.reload()
        })

        commentContainer.querySelector('#post-info-comment-pencil-icon').addEventListener('click', async () => {
            let refactorInputs = document.querySelector('#post-info-comments-container').querySelectorAll('#post-info-comment-refactor')
            let answerInputs = document.querySelector('#post-info-comments-container').querySelectorAll('#post-info-comment-answer')
            refactorInputs.forEach(input => {
                if (input !== commentContainer.querySelector('#post-info-comment-refactor')) {
                    input.classList.add('d-none')
                    input.value = ""
                }
            })
            answerInputs.forEach(input => {
                if (input !== commentContainer.querySelector('#post-info-comment-answer')) {
                    input.classList.add('d-none')
                    input.value = ""
                }
            })

            if (commentContainer.querySelector('#post-info-comment-refactor').classList.contains('d-none')) {
                commentContainer.querySelector('#post-info-comment-refactor').classList.remove('d-none')
                commentContainer.querySelector('#post-info-comment-refactor-input').value = comment.content


                commentContainer.querySelector('#post-info-comment-btn-refactor-send').addEventListener('click', async () => {
                    let text = commentContainer.querySelector('#post-info-comment-refactor-input').value
                    if (text !== "" || text.trim() !== "") {
                        await fetch(COMMENT + comment.id, {
                            method: 'PUT',
                            headers: {'Content-type': 'application/json', 'Authorization': 'Bearer ' + getToken()},
                            body: JSON.stringify({content: text})
                        })
                        window.location.reload()
                    }
                })
            } else {
                commentContainer.querySelector('#post-info-comment-refactor').classList.add('d-none')
                commentContainer.querySelector('#post-info-comment-refactor').querySelector('input').value = ""
            }

        })

        commentContainer.querySelector('#post-info-comment-btn-answer').addEventListener('click', () => {
            let refactorInputs = document.querySelector('#post-info-comments-container').querySelectorAll('#post-info-comment-refactor')
            let answerInputs = document.querySelector('#post-info-comments-container').querySelectorAll('#post-info-comment-answer')
            refactorInputs.forEach(input => {
                if (input !== commentContainer.querySelector('#post-info-comment-refactor')) {
                    input.classList.add('d-none')
                    input.value = ""
                }
            })
            answerInputs.forEach(input => {
                if (input !== commentContainer.querySelector('#post-info-comment-answer')) {
                    input.classList.add('d-none')
                    input.value = ""
                }
            })


            if (commentContainer.querySelector('#post-info-comment-answer').classList.contains('d-none')) {
                commentContainer.querySelector('#post-info-comment-answer').classList.remove('d-none')

                commentContainer.querySelector('#post-info-comment-btn-answer-send').addEventListener('click', async () => {
                    let text = commentContainer.querySelector('#post-info-comment-answer-input').value
                    if (text !== "" || text.trim() !== "") {
                        await fetch(POST_ID + postId + '/comment', {
                            method: 'POST',
                            headers: {'Content-type': 'application/json', 'Authorization': 'Bearer ' + getToken()},
                            body: JSON.stringify({content: text, parentId: comment.id})
                        })

                        window.location.reload()
                    }
                })
            } else {
                commentContainer.querySelector('#post-info-comment-answer').classList.add('d-none')
                commentContainer.querySelector('#post-info-comment-answer').querySelector('input').value = ""
            }
        })

        return commentContainer
    }

    async sendComment(postId, text, parentId = null) {
        await checkToken(getToken(), true)
        if (text === "" || text.trim() === "") {
            return
        }
        let data = {
            content: text,
            parentId: parentId
        }
        await fetch(POST_ID + postId + '/comment', {
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Authorization': 'Bearer ' + getToken()},
            body: JSON.stringify(data)
        })
        window.location.reload()
    }
}

export {PostInfoView}