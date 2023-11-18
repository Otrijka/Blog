

function route(){
    let contentPlace = document.querySelector('#content-place')
    let url = window.location.pathname
    let pageName = ''

    switch (url){
        case '/registration':
            pageName = 'RegistrationPage'
            break;
        case '/login':
            pageName = 'LoginPage'
            break;
        default:
            pageName = 'NotFoundPage'
            break
    }

    fetch('../Pages/' + 'RegistrationPage' + '.html')
        .then((response) =>{
            return response.text();
        })
        .then((html) =>{
            contentPlace.innerHTML =  html
            contentPlace.querySelectorAll('script').forEach(script =>{
                const newScript = document.createElement("script")
                Array.from(script.attributes).forEach(attr =>{
                    newScript.setAttribute(attr.name,attr.value)
                })
                newScript.appendChild(document.createTextNode(script.innerHTML))
                script.parentNode.replaceChild(newScript, script)
            })
        })
}

route()