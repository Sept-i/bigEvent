$(function () {

    // 
    layui.form.verify({
        nickname: function (value) {
            if (value.lenth > 6) {
                return "昵称的长度在1~6之间！"
            }
        }
    })



    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取用户信息失败！")
                }
                // console.log(res);
                layui.form.val("formUserInfo", res.data)

            }
        })
    }
    initUserInfo()


    // 重置表单数据   ，，不让登录名重置
    $("#btnReset").on("click", function (e) {
        e.preventDefault();
        initUserInfo()

    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        // 发Ajax请求
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                   return layui.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功') 
                // 调用父页面(index.js)中的渲染用户的头像和用户的信息 的函数
                window.parent.getUserInfo()
            }
        })
    })








})