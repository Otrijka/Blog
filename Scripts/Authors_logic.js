function compareAuthors(a,b){
    if (a.posts > b.posts) {
        return -1;
    } else if (a.posts < b.posts) {
        return 1;
    }
    // Если посты равны, сравниваем по лайкам, по убыванию
    if (a.likes > b.likes) {
        return -1;
    } else if (a.likes < b.likes) {
        return 1;
    }

    // Если и лайки тоже равны, то считаем объекты равными
    return 0;
}

function getAuthors() {
    fetch('https://blog.kreosoft.space/api/author/list', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then((data) => {
            data.sort(compareAuthors)
            data.forEach((author, index) => {
                let newAuthor = new AuthorModel()
                newAuthor.birthDate = author.birthDate
                newAuthor.created = author.created
                newAuthor.posts = author.posts
                newAuthor.likes = author.likes
                newAuthor.gender = author.gender
                newAuthor.fullName = author.fullName
                newAuthor.position = index + 1
                drawAuthor(newAuthor)
            })
        })
        .catch((error) => {
            console.log(error)
        })
}

function drawAuthor(author){
    let authorContainer = document.querySelector('#author-container')
    authorContainer.innerHTML = ''
    fetch("../Pages/Templates/AuthorTemplate.html")
        .then((response) => response.text())
        .then((template) =>{
            let authorFragment = document.createDocumentFragment();
            let authorTemplate = document.createElement('div')
            authorTemplate.innerHTML = template.trim()
            authorTemplate.querySelector('#author-template-birthDate').textContent = author.birthDate.substring(0,10).split('-').reverse().join('.')
            authorTemplate.querySelector('#author-template-created').textContent = 'Создан: ' + author.created.substring(0,10).split('-').reverse().join('.')
            authorTemplate.querySelector('#author-template-name').textContent = author.fullName
            authorTemplate.querySelector('#author-template-likes-count').textContent = 'Лайков: ' + author.likes
            authorTemplate.querySelector('#author-template-posts-count').textContent = 'Постов: ' + author.posts
            let image = authorTemplate.querySelector('#author-template-image')
            let imgSrc = ''
            switch (author.position){
                case 1:
                    imgSrc = (author.gender === 'Male') ? '../Images/Man/man-gold.svg' : '../Images/Woman/woman-gold.svg'
                    break
                case 2:
                    imgSrc = (author.gender === 'Male') ? '../Images/Man/man-silver.svg' : '../Images/Woman/woman-silver.svg'
                    break
                case 3:
                    imgSrc = (author.gender === 'Male') ? '../Images/Man/man-bronze.svg' : '../Images/Woman/woman-bronze.svg'
                    break
                default:
                    imgSrc = (author.gender === 'Male') ? '../Images/Man/man.svg' : '../Images/Woman/woman.svg'
            }
            image.src = imgSrc
            while (authorTemplate.firstChild) {
                authorFragment.appendChild(authorTemplate.firstChild);
            }
            authorContainer.appendChild(authorFragment)
        })
        .catch((error) => {
            console.log(error)
        })
}

getAuthors()

