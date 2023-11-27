import {CreatePostModel} from "../Model/CreatePostModel.js";
import {CreatePostView} from "../View/CreatePostView.js";
import {MAIN_PAGE} from "../Constants/dimens.js";

class CreatePostController {
    model
    view
    adressLevel = 1

    constructor() {
        this.model = new CreatePostModel()
        this.view = new CreatePostView()
    }


    async init() {


        const communities = await this.model.getAdminUsersCommunities()
        const tags = await this.model.getTags()
        this.view.renderTags(tags)
        this.view.renderCommunities(communities)

        this.searchAddress1()

    }


    searchAddress1() {
        let addressHandler = document.querySelector('#create-post-address-handler')
        let regionSelectBox = document.querySelector('#create-post-address-region')
        let citySelectBox = document.querySelector('#create-post-address-city')
        let streetSelectBox = document.querySelector('#create-post-address-street')
        let buildingSelectBox = document.querySelector('#create-post-address-building')

        let regionSelect = document.querySelector('#create-post-region-select')
        let citySelect = document.querySelector('#create-post-city-select')
        let streetSelect = document.querySelector('#create-post-street-select')
        let buildingSelect = document.querySelector('#create-post-building-select')



        let currentRegionID
        let currentCityID
        let currentStreetID
        let currentBuildingID


        $(regionSelect).select2({

            ajax: {
                url: "https://blog.kreosoft.space/api/address/search",
                dataType: 'json',
                type: 'GET',
                data: function (params) {
                    return {
                        parentObjectId: 0,
                        query: params.term
                    }
                },
                processResults: function (data) {
                    console.log(data)
                    data.unshift({objectId: "", text : "Не выбрано", objectGuid: ""})
                    return {
                        results: data.map(item => ({id: item.objectId, text: item.text, guid: item.objectGuid}))
                    };
                }
            },
        })

        $(regionSelect).on('select2:select', function (e) {
            if (e.params.data.id === ""){
                clearAndHideSelect(regionSelectBox)
                return
            }
            currentRegionID = e.params.data.id
            citySelectBox.classList.replace('d-none', 'd-block')
            $(citySelect).select2({
                ajax: {
                    url: "https://blog.kreosoft.space/api/address/search",
                    dataType: 'json',
                    type: 'GET',
                    data: function (params) {
                        return {
                            parentObjectId: currentRegionID,
                            query: params.term
                        }
                    },
                    processResults: function (data) {
                        data.unshift({objectId: "", text : "Не выбрано", objectGuid: ""})
                        return {
                            results: data.map(item => ({id: item.objectId, text: item.text, guid: item.objectGuid}))
                        };
                    }
                },
            })
        })

        $(citySelect).on('select2:select', function (e) {
            if (e.params.data.id === ""){
                clearAndHideSelect(citySelectBox)
                return
            }
            currentCityID = e.params.data.id
            streetSelectBox.classList.replace('d-none', 'd-block')

            $(streetSelect).select2({
                ajax: {
                    url: "https://blog.kreosoft.space/api/address/search",
                    dataType: 'json',
                    type: 'GET',
                    data: function (params) {
                        return {
                            parentObjectId: currentCityID,
                            query: params.term
                        }
                    },
                    processResults: function (data) {
                        data.unshift({objectId: "", text : "Не выбрано", objectGuid: ""})
                        return {
                            results: data.map(item => ({id: item.objectId, text: item.text, guid: item.objectGuid}))
                        };
                    }
                },
            })
        })

        $(streetSelect).on('select2:select', function (e) {
            if (e.params.data.id === ""){
                clearAndHideSelect(streetSelectBox)
                return
            }
            currentStreetID = e.params.data.id
            buildingSelectBox.classList.replace('d-none', 'd-block')

            $(buildingSelect).select2({
                ajax: {
                    url: "https://blog.kreosoft.space/api/address/search",
                    dataType: 'json',
                    type: 'GET',
                    data: function (params) {
                        return {
                            parentObjectId: currentStreetID,
                            query: params.term
                        }
                    },
                    processResults: function (data) {
                        data.unshift({objectId: "", text : "Не выбрано", objectGuid: ""})
                        return {
                            results: data.map(item => ({id: item.objectId, text: item.text, guid: item.objectGuid}))
                        };
                    }
                },
            })
        })

        $(buildingSelect).on('select2:select', function (e){
            currentBuildingID = e.params.data.id
        })

        $(regionSelect).on('select2:selecting',function (e){
            clearAndHideSelect(regionSelectBox)
        })
        $(citySelect).on('select2:selecting',function (e){
            clearAndHideSelect(citySelectBox)
        })
        $(streetSelect).on('select2:selecting',function (e){
            clearAndHideSelect(streetSelectBox)
        })
        $(buildingSelect).on('select2:selecting',function (e){
            clearAndHideSelect(buildingSelectBox)
        })

        function clearAndHideSelect(selectElement) {
            let index = Array.from(addressHandler.children).indexOf(selectElement)
            debugger
            for (let i = index + 1; i < Array.from(addressHandler.children).length; i++){
                addressHandler.children[i].classList.replace('d-block','d-none')
                addressHandler.children[i].children[1].innerHTML = ""
            }

        }
    }


    async createPost() {

        this.view.clearErrors()
        const data = this.view.getCreatePostData()

        const validateResult = this.model.validateCreatePostData(data)

        if (Object.values(validateResult).some(value => value === false)) {
            this.view.showErrors(validateResult)
            console.log(data)
            console.log(validateResult)
            return
        }


        console.log(await this.model.sendNewPostData(data))
        window.location.href = MAIN_PAGE
    }
}

export {CreatePostController}