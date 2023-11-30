import {ADMIN, COMMUNITY, SUB, SUBSCRIBE, UN_SUBSCRIBE} from "../Constants/dimens.js";

class CommunitiesView {


    async renderCommunities(template, communities, callback) {
        let holder = document.querySelector('#communities-list')
        communities.forEach(community => {
            let container = document.createElement('div')
            container.innerHTML = template.trim()

            let btn = container.querySelector('#community-template-btn')

            switch (community.userRole) {
                case ADMIN:
                    btn.classList.replace('d-block', 'd-none')
                    break
                case SUB:
                    btn.innerText = 'Отписаться'
                    btn.classList.add('btn-danger')
                    break
                default:
                    btn.innerText = 'Подписаться'
                    btn.classList.add('btn-primary')
                    break
            }
            btn.addEventListener('click', async () => {
                if (btn.innerText === 'Подписаться') {
                    btn.innerText = 'Отписаться'
                    btn.classList.replace('btn-primary', 'btn-danger')
                    await callback(SUBSCRIBE, community.id)
                } else {
                    btn.innerText = 'Подписаться'
                    btn.classList.replace('btn-danger', 'btn-primary')
                    await callback(UN_SUBSCRIBE, community.id)
                }
            })

            container.querySelector('#community-template-name').innerText = community.name
            container.querySelector('#community-template-name').style.cursor = 'pointer'
            container.querySelector('#community-template-name').addEventListener('click', () => {
                window.location.pathname = COMMUNITY + community.id
            })


            holder.appendChild(container)
        })


    }
}


export {CommunitiesView}