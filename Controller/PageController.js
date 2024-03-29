import {PageModel} from '../Model/PageModel.js'
import {PageView} from '../View/PageView.js'
import {
    MAIN_PAGE,
    LOGIN_PAGE,
    REGISTRATION_PAGE,
    PROFILE_PAGE,
    AUTHORS_PAGE,
    CREATE_POST_PAGE, COMMUNITIES,
    COMMUNITY_REGEXP, POST_INFO_REGEXP
} from "../Constants/dimens.js";
import {checkToken, getPageHtml, getToken, removeToken} from "../Functions/functions.js";


class PageController {
    model
    view

    constructor() {
        this.model = new PageModel()
        this.view = new PageView()
    }

    async route() {
        const url = window.location.pathname
        let pageName
        switch (url) {
            case CREATE_POST_PAGE:
                pageName = 'CreatePostPage'
                break;
            case REGISTRATION_PAGE:
                pageName = 'RegistrationPage'
                break;
            case LOGIN_PAGE:
                pageName = 'LoginPage'
                break;
            case PROFILE_PAGE:
                pageName = 'UserProfilePage'
                break;
            case AUTHORS_PAGE:
                pageName = 'AuthorsPage'
                break;
            case MAIN_PAGE:
                pageName = 'MainPage'
                break
            case COMMUNITIES:
                pageName = 'CommunityPage'
                break
            default:

                if (COMMUNITY_REGEXP.test(url)) {
                    pageName = 'CommunityInfoPage'
                }else if(POST_INFO_REGEXP.test(url)){
                    pageName = 'PostInfoPage'
                }
                else {
                    pageName = 'NotFoundPage'
                }
                break
        }
        const html = await getPageHtml(pageName)
        const checkResponse = await checkToken(getToken())

        this.view.renderPage(html, checkResponse)
    }

    async logout() {
        removeToken()
        await this.model.logoutUser()
        window.location.pathname = LOGIN_PAGE
    }

}

export {PageController}