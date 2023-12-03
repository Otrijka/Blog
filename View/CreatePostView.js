import {CreatePostDto} from "../Dto/CreatePostDto.js";

class CreatePostView {
    inputTitle = document.querySelector('#create-post-title')
    inputDescription = document.querySelector('#create-post-description')
    inputReadingTime = document.querySelector('#create-post-readTime')
    inputImage = document.querySelector('#create-post-image')
    inputCommunityId = document.querySelector('#create-post-community')
    inputTags = document.querySelector('#create-post-tags')
    inputAddressId = document.querySelector('#create-post-region')


    renderTags(tags) {
        tags.forEach(tag => {
            let newOption = document.createElement('option')
            newOption.text = tag.name
            newOption.value = tag.id
            this.inputTags.add(newOption)
        })
    }

    renderCommunities(communitites){
        communitites.forEach(community =>{
            let newOption = document.createElement('option')
            newOption.text = community.name
            newOption.value = community.communityId
            this.inputCommunityId.add(newOption)
        })
    }
    getCreatePostData(){
        let tags = Array.from(this.inputTags.selectedOptions).map(option => option.value)
        return new CreatePostDto(
            this.inputTitle.value.trim(),
            this.inputDescription.value.trim(),
            this.inputReadingTime.value,
            (this.inputImage.value.trim() !== "") ? this.inputImage.value : undefined,
            (this.inputCommunityId.value !== "") ? this.inputCommunityId.value : undefined,
            tags
        )
    }

    showErrors(validateResult){
        if (validateResult.title === false){
            this.inputTitle.classList.add('is-invalid')
        }
        if (validateResult.description === false){
            this.inputDescription.classList.add('is-invalid')
        }
        if (validateResult.readingTime === false){
            this.inputReadingTime.classList.add('is-invalid')
        }
        if (validateResult.image === false){
            this.inputImage.classList.add('is-invalid')
        }
        if (validateResult.communityId === false){
            this.inputCommunityId.classList.add('is-invalid')
        }
        if (validateResult.tags === false){
            this.inputTags.classList.add('is-invalid')
        }

    }

    renderCommunityValue(communityValue) {
        const option  = document.querySelector('#create-post-community').querySelector(`option[value="${communityValue}"]`)
        if (option){
            option.selected = true
        }
    }

    clearErrors(){
        this.inputTitle.classList.remove('is-invalid')
        this.inputDescription.classList.remove('is-invalid')
        this.inputImage.classList.remove('is-invalid')
        this.inputTags.classList.remove('is-invalid')
        this.inputCommunityId.classList.remove('is-invalid')
        this.inputReadingTime.classList.remove('is-invalid')
    }
}

export {CreatePostView}