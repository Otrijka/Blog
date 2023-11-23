export function getToken() {
    return localStorage.getItem('jwtToken')
}

export function setToken(token) {
    return localStorage.setItem('jwtToken', token)
}

export function removeToken() {
    return localStorage.removeItem('jwtToken')
}

export async function getPageHtml(pageName, responseHandler) {
    try {
        const response = await fetch(`../Pages/${pageName}.html`)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${response.status}`)
        }
        const text = await response.text()
        if (responseHandler && typeof responseHandler === 'function'){
            return responseHandler(text)
        }else{
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

export function buildQuery(filters) {
    let query = '?'
    const queryParts = []

    for (const key in this) {
        if (this[key] !== undefined && this[key] !== "") {
            const value = this[key]

            if (Array.isArray(value)) {
                value.forEach(item => {
                    queryParts.push(`${key}=${item}`)
                })
            } else {
                queryParts.push(`${key}=${value}`)
            }
        }
    }
    query += queryParts.join('&')
    return query
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
