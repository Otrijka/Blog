import {AUTHOR} from "../Constants/ApiUrls.js";
import {compareAuthors, getPageHtml} from "../Functions/functions.js";
import {AuthorDto} from "../Dto/AuthorDto.js";
import {
    AUTHOR_TEMPLATE,
    MALE, MAN,
    MAN_BRONZE,
    MAN_GOLD,
    MAN_SILVER, WOMAN, WOMAN_BRONZE,
    WOMAN_GOLD,
    WOMAN_SILVER
} from "../Constants/dimens.js";

class AuthorModel {
    async getAuthors() {
        let authorList = []
        try {
            const response = await fetch(AUTHOR, {
                method: 'GET',
                headers:{
                    'Content-type': 'application/json'
                }
            })
            const data = (await response.json()).sort(compareAuthors)
            data.forEach((author, index) =>{
                let newAuthor = new AuthorDto()
                newAuthor.birthDate = author.birthDate.substring(0,10).split('-').reverse().join('.')
                newAuthor.created = 'Cоздан: ' + author.created.substring(0,10).split('-').reverse().join('.')
                newAuthor.posts = 'Постов: ' + author.posts
                newAuthor.likes = 'Лайков: ' + author.likes
                newAuthor.gender = author.gender
                newAuthor.fullName = author.fullName
                newAuthor.position = index + 1

                switch (newAuthor.position) {
                    case 1:
                        newAuthor.image = (author.gender === MALE) ? MAN_GOLD : WOMAN_GOLD
                        break
                    case 2:
                        newAuthor.image = (author.gender === MALE) ? MAN_SILVER : WOMAN_SILVER
                        break
                    case 3:
                        newAuthor.image = (author.gender === MALE) ? MAN_BRONZE : WOMAN_BRONZE
                        break
                    default:
                        newAuthor.image = (author.gender === MALE) ? MAN : WOMAN
                }
                authorList.push(newAuthor)
            })
            return authorList

        } catch (error) {
            console.error(error)
        }
    }

    async getAuthorTemplate(){
        return await getPageHtml(AUTHOR_TEMPLATE)
    }
}

export {AuthorModel}