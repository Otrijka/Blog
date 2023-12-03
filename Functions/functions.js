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