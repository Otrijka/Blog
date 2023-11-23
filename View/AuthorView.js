class AuthorView {
    authorContainer = document.querySelector('#author-container')
    renderAuthors(template,authorsData){
        authorsData.forEach(author =>{
            let authorFragment = document.createDocumentFragment();
            let authorTemplate = document.createElement('div')
            authorTemplate.innerHTML = template.trim()
            authorTemplate.querySelector('#author-template-author-href').href = '/?author=' + author.fullName
            authorTemplate.querySelector('#author-template-birthDate').textContent = author.birthDate
            authorTemplate.querySelector('#author-template-created').textContent = author.created
            authorTemplate.querySelector('#author-template-name').textContent = author.fullName
            authorTemplate.querySelector('#author-template-likes-count').textContent = author.likes
            authorTemplate.querySelector('#author-template-posts-count').textContent = author.posts
            authorTemplate.querySelector('#author-template-image').src = author.image

            while (authorTemplate.firstChild) {
                authorFragment.appendChild(authorTemplate.firstChild);
            }
            this.authorContainer.appendChild(authorFragment)
        })
    }
}

export {AuthorView}