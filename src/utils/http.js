import axios from 'axios'
import router from '../router';
import { Toast } from 'vant'


// iprocess.env.NODE_ENV=='development'  //开发环境
// iprocess.env.NODE_ENV=='debug'  //测试环境
// iprocess.env.NODE_ENV=='production'  //正式环境


//创建实例
const axiosExp = axios.create({
    timeout: 10 * 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});
//请求拦截器
let toast; //加载提示
axiosExp.interceptors.request.use(config => {
    toast=Toast.loading({
        message: '努力加载中...',
        duration: 0,
        forbidClick: true
      });
    let token = undefined;
    config.headers.Authorization = 'Bearer' + token;
    return config
}), error => {
    console.info("request error!");
    return Promise.reject(error)
}

//响应拦截器
axiosExp.interceptors.response.use(response=>{
    if(response.status===200){
        toast.clear() 
        return Promise.resolve(response)
    }else{
        return Promise.reject(response)
    }
}),error=>{
    if(error.response.status){
        switch (error.response.status) {
            case 401:   //未登录
                router.replace({
                    path:'/login',
                    query:{
                        redirect:router.currentRoute.fullPath
                    }
                })
                break;
            case 403:
                Toast({
                    message: '登录过期，请重新登录',
                    duration: 1000,
                    forbidClick: true
                });
                localStorage.removeItem('token');
                setTimeout(()=>{
                    router.replace({
                        path:'/login',
                        query:{
                            redirect:router.currentRoute.fullPath
                        }
                    })
                })
                break;
            case 404:
                Toast({
                    message: '请求资源不存在',
                    duration: 1500,
                    forbidClick: true
                });
                break;
            default:
                Toast({
                    message: error.response.data.message,
                    duration: 1500,
                    forbidClick: true
                });
                return new Promise.reject(error.response)
        }
    }
}

function _get(ins, url,params) {
    return new Promise((resolve,rej)=>{
        console.log(params); 
        ins.get(url,params).then(res=>{
            resolve(res.data)
        }).catch(err=>{
            rej(err.data)
        })
    })
}

function _post(ins,url,params){
    return new Promise((resolve,rej)=>{
        ins.post(url,params)
        .then(res=>{
            resolve(res.data)
        })
        .catch(err=>{
            // rej(err.data)
            rej(
                Toast({
                    message: '数据请求错误~',
                    duration: 1500,
                    forbidClick: true
                })
            )
        })
    })
}
function $get(url,params) {return _get(axiosExp, url,params); }
function $post(url, params) { return _post(axiosExp, url, params); }


export default {
    $get,
    $post
}








const errorHandle = (status, other) => {
    switch (status) {
        case 401:
            console.log('未登录')
            break;
        case 403:
            console.log('未登录')
            break;

        case 404:
            console.log('请求资源不存在')
            break;
    }
}