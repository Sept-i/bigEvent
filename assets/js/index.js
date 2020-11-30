$(function () {
    // 二 调用getUserInfo()获取用户基本信息
    getUserInfo()
})



//一 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",


        // headers是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            // 渲染用户头像  调用renderAvatar函数
            rederAvatar(res.data)
        },
        // 无论成功失败都会调  complete回调函数  作用: 禁止未登录的直接进主页
        completefun: function (res) {
            if (res.responseJSON.status == 1 && res.responseJSON.message === '身份认证失败') {
                // 1 强制清空token
                localStorage.removeItem("token");
                // 2 强制跳转到登录页面
                location.href = 'login.html'
            }
        }
    })
}



// 二 渲染用户头像
function rederAvatar(user) {
    // 1 获取用户名称
    var name = user.nickname || user.username; 
    // 2 渲染用户名
    $("#welcome").html("欢迎 &nbsp;" + name)

    // 3
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        // 拿到名字第一个字符，.toUpperCase（）转换为大写
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }

}





// 三 退出功能
$("#logout").on("click", function () {
    // var status = window.confirm("确定退出吗？")
    // console.log(status);
    layer.confirm('你确定要退出吗?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        //do something

        // 清除token，再跳转到登录页面
        localStorage.removeItem("token");
        location.href = "login.html"

        layer.close(index);
    });
})