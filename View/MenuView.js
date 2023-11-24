import {CURRENT_PAGE_SIZE, MAX_LETTERS_ON_DESCRIPTION} from "../Constants/dimens.js";
import {isImageValid} from "../Functions/functions.js";

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

    renderPosts(template, posts) {
        this.postsContainer.innerHTML = ''
        posts.forEach(post => {
            let cardTemplate = document.createElement('div')
            cardTemplate.innerHTML = template.trim()
            cardTemplate.querySelector('#post-template-author').textContent = post.author
            cardTemplate.querySelector('#post-template-title').textContent = post.title

            let descriptionHolder = cardTemplate.querySelector('#post-template-description')


            let showedLetters = 0
            let words = post.description.split(' ')
            let iterator = 0;
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

            cardTemplate.querySelector('#post-template-date').textContent = post.date
            cardTemplate.querySelector('#post-template-comments-count').textContent = post.commentsCount
            cardTemplate.querySelector('#post-template-likes-count').textContent = post.likes
            cardTemplate.querySelector('#post-template-reading-time').textContent = 'Время чтения: ' + post.readingTime + ' мин.'
            cardTemplate.querySelector('#post-template-community').textContent = (post.communityName != null) ? 'в сообществе ' + '"' + post.communityName + '"' : ''

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

    getPageSize(){
        return document.querySelector('#filter-page-post-size').value
    }

    renderBtnNewPost(token){
        if (token === null){
            document.querySelector('#btn-new-post').classList.add('d-none')
        }else{
            document.querySelector('#btn-new-post').classList.remove('d-none')
            document.querySelector('#btn-new-post').classList.add('d-sm-block')
        }
    }

    renderFiltersValues(params) {
        params.tags.forEach(tagId =>{
            const  option = document.querySelector('#filter-tags').querySelector(`option[value="${tagId}"]`)
            if (option){
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

export {MenuView}