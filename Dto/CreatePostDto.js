import {AppValidator} from "../Functions/AppValidator.js";

class CreatePostDto {

    title = undefined
    description = undefined
    readingTime = undefined
    image = undefined
    communityId = undefined
    addressId = undefined
    tags = []
    
    constructor(title, description, readingTime, image, communityId, addressId, tags) {
        this.title = title;
        this.description = description;
        this.readingTime = readingTime;
        this.image = image;
        this.communityId = communityId;
        this.addressId = addressId;
        this.tags = tags;
    }
    isValid(){
        let validator = new AppValidator()
        return {
            title: validator.TitleDescriptionIsValid(this.title),
            description: validator.TitleDescriptionIsValid(this.description),
            readingTime: validator.ReadingTimeIsValid(this.readingTime),
            image: validator.UrlIsValid(this.image),
            communityId : true,
            addressId : true,
            tags : validator.TagsIsValid(this.tags)
        }
    }
}

export {CreatePostDto}