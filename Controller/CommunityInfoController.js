import {CommunityInfoModel} from "../Model/CommunityInfoModel.js";
import {CommunityInfoView} from "../View/CommunityInfoView.js";
import {buildQuery, smoothScrollToTop} from "../Functions/functions.js";
import {GO_NEXT_PAGE, GO_PREVIOUS_PAGE} from "../Constants/dimens.js";

class CommunityInfoController {
    model
    view
    communityId

    currentQuery = new URLSearchParams(window.location.search)


    constructor() {
        this.model = new CommunityInfoModel()
        this.view = new CommunityInfoView()
        this.communityId = window.location.pathname.split('/')[2]
    }

    async init() {
        const tags = await this.model.getTags()
        this.view.renderTags(tags)

        let info = await this.model.getCommunityInfo(this.communityId)
        const adminTemplate = await this.model.getAdminTemplate()

        this.view.renderInfo(adminTemplate, info, this.communityId, this.model.doBtnAction)
        this.view.renderFiltersValues(this.model.getFiltersValuesFromQuery(this.currentQuery))

        const posts = await this.model.getCommunityPosts(this.communityId, this.currentQuery.toString())

        this.view.renderPosts(await this.model.getPostTemplate(), posts)

        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)

    }

    async useFilters() {
        this.model.currentPage = 1
        const query = buildQuery(this.view.getFiltersValues())
        console.log(query)
        this.currentQuery = query
        const posts = await this.model.getCommunityPosts(this.communityId, query)
        window.history.pushState({}, '', window.location.pathname + '?' + this.currentQuery)
        this.view.renderPosts(await this.model.getPostTemplate(), posts)
    }

    async switchPage(param) {

        if (param === GO_NEXT_PAGE) {
            this.model.currentPage = this.model.currentPage < this.model.currentPageCount ? this.model.currentPage + 1 : this.model.currentPage
        } else if (param === GO_PREVIOUS_PAGE) {
            this.model.currentPage = this.model.currentPage > 1 ? this.model.currentPage - 1 : this.model.currentPage
        }

        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        const query = buildQuery(this.view.getFiltersValues(this.model.currentPage))
        this.currentQuery = query
        const posts = await this.model.getCommunityPosts(this.communityId, this.currentQuery)
        window.history.pushState({}, '', window.location.pathname + '?' + this.currentQuery)
        this.view.renderPosts(await this.model.getPostTemplate(), posts)

        smoothScrollToTop()
    }

    async changePageSize() {
        const query = buildQuery(this.view.getFiltersValues())
        this.currentQuery = query
        const posts = await this.model.getCommunityPosts(this.communityId, this.currentQuery)
        this.view.checkAndDisableBtn(this.model.currentPage, this.model.currentPageCount)
        window.history.pushState({}, '', window.location.pathname + '?' + this.currentQuery)
        this.view.renderPosts(await this.model.getPostTemplate(), posts)

        smoothScrollToTop()
    }
}

export {CommunityInfoController}