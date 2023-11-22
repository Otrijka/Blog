class FiltersDto {
    tags = undefined
    author = undefined
    min = undefined
    max = undefined
    sorting = undefined
    onlyMyCommunities = false

    page = 1
    size = 5


    BuildQuery() {
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
}

export {FiltersDto}