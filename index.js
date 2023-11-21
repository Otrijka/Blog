import {PageController} from './Controller/PageController.js'

let pageController = new PageController()

document.addEventListener('DOMContentLoaded', async () => {
    await pageController.route()
})
document.querySelector('#btn-logout-header').addEventListener('click',pageController.logout)