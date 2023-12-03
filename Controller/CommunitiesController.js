import {CommunitiesModel} from "../Model/CommunitiesModel.js";
import {CommunitiesView} from "../View/CommunitiesView.js";

class CommunitiesController {
    model
    view

    constructor() {
        this.model = new CommunitiesModel()
        this.view = new CommunitiesView()
    }

    async init(){
        const template = await this.model.getCommunityTemplate()
        const communities = await this.model.getCommunities()

        await this.view.renderCommunities(template,communities, this.model.doBtnAction)
    }
}



export {CommunitiesController}