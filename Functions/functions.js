import {PROFILE} from "../Constants/ApiUrls.js";
import {LOGIN_PAGE} from "../Constants/dimens.js";

export function getToken() {
    return window.localStorage.getItem('jwtToken')
}

export function setToken(token) {
    return window.localStorage.setItem('jwtToken', token)
}

export function removeToken() {
    return window.localStorage.removeItem('jwtToken')
}

export async function getPageHtml(pageName, responseHandler) {
    try {
        const response = await fetch(`../Pages/${pageName}.html`)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${response.status}`)
        }
        const text = await response.text()
        if (responseHandler && typeof responseHandler === 'function') {
            return responseHandler(text)
        } else {
            return text
        }
    } catch (error) {
        console.error(error)
    }
}


export function compareAuthors(a, b) {
    if (a.posts > b.posts) {
        return -1;
    } else if (a.posts < b.posts) {
        return 1;
    }
    if (a.likes > b.likes) {
        return -1;
    } else if (a.likes < b.likes) {
        return 1;
    }
    return 0;
}


export function isImageValid(url, callback) {
    let img = new Image();
    img.onload = function () {
        callback(true);
    };
    img.onerror = function () {
        callback(false);
    };
    img.src = url;
}


export function smoothScrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}

export function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


export function buildQuery(filters) {
    let query = new URLSearchParams()

    for (const param in filters) {
        if (filters[param] !== "") {
            const value = filters[param]

            if (Array.isArray(value)) {
                value.forEach(item => {
                    query.append(param, item)
                })
            } else {
                query.set(param, value)
            }
        }
    }

    return query
}


export async function checkToken(token, redirect = false) {
    try {
        const response = await fetch(PROFILE, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            if (redirect) {
                redirectTo(LOGIN_PAGE)
            }
            removeToken()
            throw new Error(`Failed to fetch ${response.status}`)
        }
        const userProfile = await response.json()
        return {email: userProfile.email, id: userProfile.id}
    } catch (error) {
    }
}

export function redirectTo(pathName) {
    if (window.location.pathname !== pathName) {
        window.location.pathname = pathName
    }
}

export function normalizeDate(date) {
    if (date === null){
        return "не указана"
    }
    return date.substring(0, 10).split('-').reverse().join('.')
}

export function normalizeDateTime(inputDateTime) {
    const dateTime = new Date(inputDateTime);

    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');

    const formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;

    return formattedDateTime;
}


export async function addAddressSelect(parentAddress, currentAddressLevel, addressInfo) {

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
            await addAddressSelect(address.id, currentAddressLevel + 1, addressInfo);
            smoothScrollToBottom()
        }
    });
}

export function clearSelects(selectRef) {
    let addressHandler = document.querySelector('#create-post-address-handler');
    let childrenArray = Array.from(addressHandler.children);

    let index = childrenArray.indexOf(document.querySelector('#' + selectRef));

    if (index !== -1) {
        let newArray = childrenArray.slice(0, index + 1);

        addressHandler.innerHTML = '';

        newArray.forEach(child => addressHandler.appendChild(child));
    }
}
