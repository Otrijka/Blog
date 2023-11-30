import {ADMIN, MALE, MAN, SUB, SUBSCRIBE, UN_SUBSCRIBE, WOMAN} from "../Constants/dimens.js";

class CommunityInfoView {


    renderTags(tags) {
        let tagFilter = document.querySelector('#filter-tags')
        tags.forEach(tag => {
            let newOption = document.createElement('option')
            newOption.text = tag.name
            newOption.value = tag.id
            tagFilter.add(newOption)
        })
    }

    renderInfo(adminTemplate, info, callback) {
        let adminsHolder = document.querySelector('#communityInfo-admins-holder')
        let admins = info.administrators
        admins.forEach(admin => {
            let adminFragment = document.createDocumentFragment();
            let adminContainer = document.createElement('div')
            adminContainer.innerHTML = adminTemplate.trim()
            adminContainer.querySelector('#admin-template-image').src = (admin.gender === MALE) ? MAN : WOMAN
            adminContainer.querySelector('#admin-template-name').src = admin.fullName

            while (adminContainer.firstChild) {
                adminFragment.appendChild(adminContainer.firstChild);
            }

            adminsHolder.appendChild(adminFragment)
        })
        document.querySelector('#communityInfo-name').innerText = info.name
        document.querySelector('#communityInfo-description').innerText = info.description
        document.querySelector('#communityInfo-subs-counter').innerText = info.subscribersCount + ' подписчиков'
        document.querySelector('#communityInfo-private-status').innerText = (info.isClosed === true) ? "Тип сообщества: закрытое" : "Тип сообщества: открытое"

        let btnSub = document.querySelector('#communityInfo-btn-sub-unsub')
        let btnWritePost = document.querySelector('#communityInfo-btn-write-post')

        switch (info.userRole) {
            case ADMIN:
                btnSub.classList.add('d-none')
                btnWritePost.classList.remove('d-none')
                break
            case SUB:
                btnSub.innerText = 'Отписаться'
                btnSub.classList.add('btn-danger')
                break
            default:
                btnSub.innerText = 'Подписаться'
                btnSub.classList.add('btn-primary')
                break
        }

        btnSub.addEventListener('click', async () => {
            if (btnSub.innerText === 'Подписаться') {
                btnSub.innerText = 'Отписаться'
                btnSub.classList.replace('btn-primary', 'btn-danger')
                await callback(SUBSCRIBE, info.id)
            } else {
                btnSub.innerText = 'Подписаться'
                btnSub.classList.replace('btn-danger', 'btn-primary')
                await callback(UN_SUBSCRIBE, info.id)
            }
        })

    }
}

export {CommunityInfoView}