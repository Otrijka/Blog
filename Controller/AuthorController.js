import {AuthorView} from "../View/AuthorView.js";
import {AuthorModel} from "../Model/AuthorModel.js";

class AuthorController {
    model
    view

    constructor() {
        this.model = new AuthorModel()
        this.view = new AuthorView()
    }

    async init(){
        const authorsData = await this.model.getAuthors()
        const template = await this.model.getAuthorTemplate()
        this.view.renderAuthors(template,authorsData)
    }
}

export {AuthorController}