import {MenuModel} from "../Model/MenuModel.js";
import {MenuView} from "../View/MenuView.js";

class MenuController {
    model
    view
    template

    constructor() {
        this.model = new MenuModel()
        this.view = new MenuView()
    }

    async init(){
        this.view.renderTags(await this.model.getTags())
        const posts = await this.model.getPosts()
        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        this.template = await this.model.getPostTemplate()

        this.view.renderPosts(this.template,posts)
    }

    async useFilters(){
        this.view.renderTags(await this.model.getTags())
        this.model.currentPage = 1
        const query = (this.view.getFiltersValues()).BuildQuery()
        const posts = await this.model.getPosts(query)
        window.history.pushState({}, '', window.location.pathname + query)
        this.view.renderPosts(this.template,posts)
    }

    async nextPage(){
        this.view.renderTags(await this.model.getTags())
        this.model.currentPage = (this.model.currentPage === this.model.currentPageCount) ? this.model.currentPage : this.model.currentPage + 1
        const query = (this.view.getFiltersValues()).BuildQuery()
        const posts = await this.model.getPosts(query)
        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        this.view.renderPosts(this.template,posts)
    }

    async previousPage(){
        this.view.renderTags(await this.model.getTags())
        this.model.currentPage = (this.model.currentPage === 1) ? 1 : this.model.currentPage - 1
        const query = (this.view.getFiltersValues()).BuildQuery()
        const posts = await this.model.getPosts(query)
        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        this.view.renderPosts(this.template,posts)
    }
}

export {MenuController}