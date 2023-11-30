import {CommunitiesController} from "../Controller/CommunitiesController.js";

let communitiesController = new CommunitiesController()

await communitiesController.init()


document.querySelector('#comm')