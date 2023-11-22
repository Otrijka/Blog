import {PageController} from './Controller/PageController.js'

let pageController = new PageController()

//Листенер на загрузку контента

await pageController.route()


//Листенер на выход по кнопке
document.querySelector('#btn-logout-header').addEventListener('click', async () => {
    await pageController.logout()
})