import { message } from "antd";
import Global from "./global";
import 'isomorphic-fetch'

const request = (url: string, config: any) => {
    return fetch(url, config)
        .then((res: any) => {
            if (!res.ok) {
                // 服务器异常返回
                throw Error('接口请求异常');
            }
            // console.log(res);

            return res.json();
        })
        .then((data: any) => {
            if (data.code === 999) {
                if (localStorage.getItem('honghuToken')) {
                    localStorage.removeItem('honghuToken')
                }
                message.error(data.msg, 2, () => {
                    window.location.href = ''
                })
                return data;
            } else if (data.code === 888) {
                if (localStorage.getItem('honghuToken')) {
                    localStorage.removeItem('honghuToken')
                }
                message.error(data.msg, 2, () => {
                    window.location.href = ''
                })
                return data;
            }
            return data;
        })
        .catch((error: any) => {
            return Promise.reject(error);
        });
};

// GET请求
export const get = (url: string) => {
    let requrl = Global.httpUrl + url;
    // let requrl = 'https://cqredcross.org.cn/' + url;
    return request(requrl, { method: 'GET' });
};

// POST请求
export const post = (url: string, data?: any, customUrl?: string) => {
    let requrl = customUrl ? customUrl + url : Global.httpUrl + url;
    // let requrl = 'https://cqredcross.org.cn/' + url;
    // let requrl = 'https://tongcheng.honghukeji.net/admin/' + url;
    return request(requrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded;',
            // 'Content-Type': 'application/json;',
            "Accept": "application/json",
            'token': localStorage.getItem('honghuToken') || ""
        },
        body: JSON.stringify(data),
        // bode:data,
    });
};
