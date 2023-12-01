import {AUTHOR} from "../Constants/ApiUrls.js";
import {compareAuthors, getPageHtml, normalizeDate} from "../Functions/functions.js";
import {AuthorDto} from "../Dto/AuthorDto.js";
import {
    AUTHOR_TEMPLATE,
    MALE, MAN, MEDAL_BRONZE, MEDAL_GOLD, MEDAL_SILVER,
    WOMAN,
} from "../Constants/dimens.js";

class AuthorModel {
    async getAuthors() {
        let authorList = []
        try {
            const response = await fetch(AUTHOR, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            let data = (await response.json()).sort(compareAuthors)
            data.forEach((author, index) => {
                let newAuthor = new AuthorDto()
                newAuthor.birthDate = normalizeDate(author.birthDate)
                newAuthor.created = 'Cоздан: ' + normalizeDate(author.created)
                newAuthor.posts = 'Постов: ' + author.posts
                newAuthor.likes = 'Лайков: ' + author.likes
                newAuthor.gender = author.gender
                newAuthor.fullName = author.fullName
                newAuthor.position = index + 1

                newAuthor.image = (author.gender === MALE) ? MAN : WOMAN

                switch (newAuthor.position) {
                    case 1:
                        newAuthor.medal = MEDAL_GOLD
                        break
                    case 2:
                        newAuthor.medal = MEDAL_SILVER
                        break
                    case 3:
                        newAuthor.medal = MEDAL_BRONZE
                        break
                    default:
                        newAuthor.medal = ""
                }
                authorList.push(newAuthor)
            })
            return authorList.sort((a,b) => a.fullName.localeCompare(b.fullName, 'en-US'))

        } catch (error) {
            console.error(error)
        }
    }

    async getAuthorTemplate() {
        return await getPageHtml(AUTHOR_TEMPLATE)
    }
}

export {AuthorModel}