$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)







    // 上传按钮绑定点击事件   // 文件选择
    $('#btnimage').on('click', function () {
        $("#file").click();
    })



    //上传图片   为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        if (this.files.length <= 0) {
            return layui.layer.msg("未选择上传图片")
        }
        // 获取用户上传的图片
        var file = this.files[0];
        // 将上传的图片转换为地址
        var newImgURL = URL.createObjectURL(file);

        $image
            .cropper('destroy') //销毁旧的裁剪区域图片
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域



        // js原生的方法——————————————🦄
        //js中文件读取器   构造函数  FileReader
        // var reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function () {
        //     $image
        //         .cropper('destroy') //销毁旧的裁剪区域图片
        //         .attr('src', newImgURL) //重新设置图片路径
        //         .cropper(options) // 重新初始化裁剪区域
        // }

    })

    // 为确定按钮绑定的点击事件
    $('#btnnewimg').on("click", function () {
        // 步骤：拿到用户裁剪后的图片，发Ajax请求把头像上传到服务器

        // 将裁剪后的图片，输出为 base64 格式的字符串(图片的代码)
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串




        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新头像失败！")
                }
                layui.layer.msg("更新头像成功")
                window.parent.getUserInfo()
            }
        })
    })

})