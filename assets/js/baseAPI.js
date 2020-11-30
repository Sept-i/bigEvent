// 每次请求Ajax的时候,会先调用 ajaxPrefilter 函数
//  ajaxPrefilter 函数 可以拿到 给Ajax提供的配置对象

// 每次发送Ajax之前,都会经过这个函数处理--------请求拦截
$.ajaxPrefilter(function (options) {

    // console.log(options.url);

    // 发起真正的Ajax请求之前,统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url


    // 统一为有权限的接口，设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


})