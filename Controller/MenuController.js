import {MenuModel} from "../Model/MenuModel.js";
import {MenuView} from "../View/MenuView.js";
import {buildQuery, checkToken, getToken, smoothScrollToTop} from "../Functions/functions.js";
import {GO_NEXT_PAGE, GO_PREVIOUS_PAGE} from "../Constants/dimens.js";

class MenuController {
    model
    view
    template
    currentQuery

    constructor() {
        this.model = new MenuModel()
        this.view = new MenuView()
        this.currentQuery = new URLSearchParams(window.location.search)
    }

    async init() {

        this.view.renderBtnNewPost(getToken())

        this.view.renderTags(await this.model.getTags())

        this.view.renderFiltersValues(this.model.getFiltersValuesFromQuery(this.currentQuery))

        this.template = await this.model.getPostTemplate()

        const posts = await this.model.getPosts(this.currentQuery.toString())

        this.view.renderPosts(this.template, posts)

        this.view.renderPagination(this.model.currentPage, this.model.currentPageCount)

        let btns = document.querySelectorAll('.number')
        btns.forEach(btn => btn.addEventListener('click', async () => {
            this.currentQuery.set('page', btn.innerText)
            window.location.search = this.currentQuery.toString()
        }))
    }

    async useFilters() {
        const query = buildQuery(this.view.getFiltersValues())
        window.location.search = query.toString()

    }

    async switchPage(param = null) {
        if (param === GO_NEXT_PAGE) {
            this.model.currentPage = this.model.currentPage < this.model.currentPageCount ? this.model.currentPage + 1 : this.model.currentPage
        } else if (param === GO_PREVIOUS_PAGE) {
            this.model.currentPage = this.model.currentPage > 1 ? this.model.currentPage - 1 : this.model.currentPage
        }

        const query = buildQuery(this.view.getFiltersValues(this.model.currentPage))
        window.location.search = query

    }

}

export {MenuController}