import {PageController} from '../Controller/PageController.js'

let pageController = new PageController()
await pageController.route()

document.querySelector('#btn-logout-header').addEventListener('click', async () => {
    await pageController.logout()
})