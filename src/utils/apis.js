import http from './http'

export function axiosPost(url, params) {
    return new Promise((resolve, reject) => {
        http.$post(url, params).then((res) => {
            resolve(res)
        }).catch(r => {
        })
    })

}