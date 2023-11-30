import {CommunityInfoModel} from "../Model/CommunityInfoModel.js";
import {CommunityInfoView} from "../View/CommunityInfoView.js";

class CommunityInfoController {
    model
    view
    constructor() {
        this.model = new CommunityInfoModel()
        this.view = new CommunityInfoView()
    }
}

export {CommunityInfoController}