import {CreatePostModel} from "../Model/CreatePostModel.js";
import {CreatePostView} from "../View/CreatePostView.js";
import {MAIN_PAGE} from "../Constants/dimens.js";
import {getPageHtml, smoothScrollToBottom} from "../Functions/functions.js";


async function newSelectF(parentAddress, currentAddressLevel, addressInfo) {

    let addressHandler = document.querySelector('#create-post-address-handler');
    let template = await getPageHtml('/Templates/AddressSelectTemplate');
    let newContainerId = 'create-post-address-level-' + currentAddressLevel;
    let newSelectId = 'create-post-select-level-' + currentAddressLevel;
    let newLabelId = 'create-post-label-' + currentAddressLevel;

    let templateContainer = document.createElement('div');
    templateContainer.id = newContainerId;
    templateContainer.classList.add('form-group', 'mb-2');

    templateContainer.innerHTML = template;

    if (currentAddressLevel === 1) {
        templateContainer.querySelector('#create-post-label-').innerText = 'Субъект РФ'
    }

    templateContainer.querySelector('#create-post-select-level-').id = newSelectId;
    templateContainer.querySelector('#create-post-label-').id = newLabelId;
    templateContainer.querySelector('#' + newLabelId).htmlFor = newSelectId;
    addressHandler.appendChild(templateContainer);

    let newSelect = document.querySelector('#' + newSelectId);

    $(newSelect).select2({
        ajax: {
            url: "https://blog.kreosoft.space/api/address/search",
            dataType: 'json',
            type: 'GET',
            data: function (params) {
                return {
                    parentObjectId: parentAddress,
                    query: params.term
                };
            },
            processResults: function (data) {
                data.unshift({objectId: "", text: "Не выбрано", objectGuid: "", objectLevelText: ""});
                return {
                    results: data.map(item => ({
                        id: item.objectId,
                        text: item.text,
                        guid: item.objectGuid,
                        levelText: item.objectLevelText
                    }))
                };
            }
        },
    });

    let placeholderOption = new Option('Не выбрано', {
        objectId: "",
        text: "Не выбрано",
        objectGuid: "",
        objectLevelText: ""
    }, true, true);
    $(newSelect).append(placeholderOption).trigger('change');

    $(newSelect).on('select2:select', async function (e) {
        let address = {
            id: e.params.data.id,
            guid: e.params.data.guid,
            text: e.params.data.text,
            levelText: e.params.data.levelText,
        };

        if (newLabelId === 'create-post-label-1'){
            document.querySelector('#' + newLabelId).innerText = 'Субъект РФ'
        }else{
            document.querySelector('#' + newLabelId).innerText = (address.levelText !== '') ? address.levelText : "Следующий элемент адреса";

        }

        if (addressInfo[currentAddressLevel] !== undefined) {
            addressInfo[currentAddressLevel] = address;
            addressInfo.splice(currentAddressLevel + 1)
        } else {
            addressInfo.push(address)
        }
        console.log("Текущая цепочка");
        console.log(addressInfo);
        console.log("---------------");

        const nextData = await (await fetch('https://blog.kreosoft.space/api/address/search?parentObjectId=' + address.id)).json()
        clearSelects(newContainerId)
        if (nextData.length === 0) {
            return
        }

        if (address.id !== '') {
            await newSelectF(address.id, currentAddressLevel + 1, addressInfo);
            smoothScrollToBottom()
        }
    });
}

function clearSelects(selectRef) {
    let addressHandler = document.querySelector('#create-post-address-handler');
    let childrenArray = Array.from(addressHandler.children);

    let index = childrenArray.indexOf(document.querySelector('#' + selectRef));

    if (index !== -1) {
        let newArray = childrenArray.slice(0, index + 1);

        addressHandler.innerHTML = '';

        newArray.forEach(child => addressHandler.appendChild(child));
    }
}

class CreatePostController {
    model
    view

    currentAddressLevel = 1
    addressInfo = [{
        id: 0,
        guid: '',
        text: "Страна"
    }]

    constructor() {
        this.model = new CreatePostModel()
        this.view = new CreatePostView()
    }


    async init() {

        const communities = await this.model.getAdminUsersCommunities()
        const tags = await this.model.getTags()
        this.view.renderTags(tags)
        this.view.renderCommunities(communities)

        await newSelectF(0, this.currentAddressLevel, this.addressInfo)
    }

    async createPost() {

        this.view.clearErrors()
        let data = this.view.getCreatePostData()

        if (this.addressInfo.length > 1 && this.addressInfo[1].guid !== '') {
            let latestAddressIndex = this.addressInfo.length - 1
            while (this.addressInfo[latestAddressIndex].guid === '') {
                latestAddressIndex -= 1
            }
            data.addressId = this.addressInfo[latestAddressIndex].guid
        }

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