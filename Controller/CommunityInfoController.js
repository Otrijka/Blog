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
        this.view.renderTags(await this.model.getTags())

        let info = await this.model.getCommunityInfo(this.communityId)
        const adminTemplate = await this.model.getAdminTemplate()

        this.view.renderInfo(adminTemplate, info, this.communityId, this.model.doBtnAction)
        this.view.renderFiltersValues(this.model.getFiltersValuesFromQuery(this.currentQuery))

        const posts = await this.model.getCommunityPosts(this.communityId, this.currentQuery.toString())

        this.view.renderPosts(await this.model.getPostTemplate(), posts)

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

    async switchPage(param) {

        if (param === GO_NEXT_PAGE) {
            this.model.currentPage = this.model.currentPage < this.model.currentPageCount ? this.model.currentPage + 1 : this.model.currentPage
        } else if (param === GO_PREVIOUS_PAGE) {
            this.model.currentPage = this.model.currentPage > 1 ? this.model.currentPage - 1 : this.model.currentPage
        }

        const query = buildQuery(this.view.getFiltersValues(this.model.currentPage))
        window.location.search = query

    }

}

export {CommunityInfoController}