import {CommunityInfoModel} from "../Model/CommunityInfoModel.js";
import {CommunityInfoView} from "../View/CommunityInfoView.js";

class CommunityInfoController {
    model
    view
    communityId

    constructor() {
        this.model = new CommunityInfoModel()
        this.view = new CommunityInfoView()
        this.communityId = window.location.pathname.split('/')[2]
    }

    async init() {

        const tags = await this.model.getTags()
        this.view.renderTags(tags)

        let info = await this.model.getCommunityInfo(this.communityId)
        info.userRole = await this.model.getUserRole(this.communityId)
        console.log(info)

        const adminTemplate = await this.model.getAdminTemplate()

        this.view.renderInfo(adminTemplate, info, this.model.doBtnAction)

    }
}

export {CommunityInfoController}