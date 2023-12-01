import {MenuModel} from "../Model/MenuModel.js";
import {MenuView} from "../View/MenuView.js";
import {buildQuery, getToken, smoothScrollToTop} from "../Functions/functions.js";
import {GO_NEXT_PAGE, GO_PREVIOUS_PAGE} from "../Constants/dimens.js";

class MenuController {
    model
    view
    template
    currentQuery = new URLSearchParams(window.location.search)

    constructor() {
        this.model = new MenuModel()
        this.view = new MenuView()
    }


    async init() {

        this.view.renderBtnNewPost(getToken())

        this.view.renderTags(await this.model.getTags())

        this.view.renderFiltersValues(this.model.getFiltersValuesFromQuery(this.currentQuery))

        this.template = await this.model.getPostTemplate()

        const posts = await this.model.getPosts(this.currentQuery.toString())

        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        this.view.renderPosts(this.template, posts)
    }

    async useFilters() {
        this.model.currentPage = 1
        const query = buildQuery(this.view.getFiltersValues())
        this.currentQuery = query
        this.view.renderFiltersValues(this.model.getFiltersValuesFromQuery(this.currentQuery))
        const posts = await this.model.getPosts(this.currentQuery)
        window.history.pushState({}, '', window.location.origin + '/?' + this.currentQuery)
        this.view.renderPosts(this.template, posts)
    }

    async switchPage(param) {

        if (param === GO_NEXT_PAGE) {
            this.model.currentPage = this.model.currentPage < this.model.currentPageCount ? this.model.currentPage + 1 : this.model.currentPage
        } else if (param === GO_PREVIOUS_PAGE) {
            this.model.currentPage = this.model.currentPage > 1 ? this.model.currentPage - 1 : this.model.currentPage
        }

        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        const query = buildQuery(this.view.getFiltersValues(this.model.currentPage))
        this.view.renderFiltersValues(this.model.getFiltersValuesFromQuery(this.currentQuery))
        this.currentQuery = query
        const posts = await this.model.getPosts(this.currentQuery)
        window.history.pushState({}, '', window.location.origin + '?' + this.currentQuery)
        this.view.renderPosts(this.template, posts)

        smoothScrollToTop()
    }

    async changePageSize() {

        const query = buildQuery(this.view.getFiltersValues())
        this.currentQuery = query
        this.view.renderFiltersValues(this.model.getFiltersValuesFromQuery(this.currentQuery))
        const posts = await this.model.getPosts(this.currentQuery)
        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        window.history.pushState({}, '', window.location.origin + '?' + this.currentQuery)
        this.view.renderPosts(this.template, posts)

        smoothScrollToTop()
    }
}

export {MenuController}