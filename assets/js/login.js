$(function () {
    //一，登录注册切换
    $("#link-reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();

    })
    $("#link-login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();

    });


    // 二，给表单添加自定义校验规则
    // form.verify()函数自定义校验规则
    layui.form.verify({
        
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一样
        repwd: function (value) {
            // 形参 拿到 密码确认框 的内容
            // 还要 拿到 密码框中  的内容
            // 进行等于的判断
            // 判断失败,return一个提示消息

            var pwd = $(".reg-box [name=password]").val();  //密码框中的内容
            if (value !== pwd) {
                return "两次密码不一致！"
            }
        }
    });



    // 三 注册功能
    // 监听注册表单的提交事件
    $("#form-reg").on("submit", function (e) {
        e.preventDefault()
        // console.log($(this).serialize()); 获取表单的数据

        $.ajax({
            type: "post",
            url: "/api/reguser",
            data: {
                username: $("#form-reg [name=username]").val(),
                password: $("#form-reg [name=password]").val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    // alert(res.message)
                    layui.layer.msg(res.message) //status不等于0,说明注册失败
                } else {
                    $("#link-login").click() //登录成功就模拟人点击 登录按钮 //用户名liuxiaoliuliu 密码:123456789
                }
            }
        })
    })


    // 四 监听登陆表单提交事件
    $("#form-login").submit(function (e) {
        e.preventDefault()

        $.ajax({
            type: "post",
            url: "/api/login",
            data: $(this).serialize(),//快速获取表单中的数据
            
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("登陆失败")
                }
               layui.layer.msg("登陆成功")
                // 将登陆成功得到的 token 字符串 存到本地储存
                localStorage.setItem("token", res.token)

                //登录成功跳转到首页
                location.href = "index.html";
            }
        })
    })


})