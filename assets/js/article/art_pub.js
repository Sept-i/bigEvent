$(function () {
    initCate()

    // 调用富文本编辑器
    initEditor()

    // 加载文章分类
    function initCate() {
        $.ajax({
            type: 'get',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('初始化文章分类失败！')
                }
                //模板引擎渲染分类下拉菜单
                var html = template('tpl-cate', res)
                $('[name=cate_id]').html(html);
                // 注意：一定要调用 layui的 form.render()方法
                layui.form.render() //layui的方法，重新渲染文章类别表单
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 选择封面按钮绑定点击事件
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click()
    })
    // coverFile绑定change事件
    $('#coverFile').on('change', function (e) {
        //拿到用户选择的文件
        var files = this.files[0]
        console.log(files);
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件创建对应 URL地址
        var newImgURL = URL.createObjectURL(files)
        // 为裁剪区域重新设置图片
        $image
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章发布状态
    var art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })


    // 为form表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 1
        e.preventDefault()
        // 2 基于form表单，快速创建一个FormData对象
        var fd = new FormData(this)
        // 3 文章发布状态存到 fd 里
        fd.append('state', art_state)

        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })

        // 4 将封面裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5 将文件对象存到 fd 里
                fd.append('cover_img', blob)
                // 6 调发布文章 函数
                publishArticle(fd)
            })
    })


    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            type: "post",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('发布文章失败')
                }
                layui.layer.msg('发布文章成功')
                location.href='../../../art_list.html'
            }
        })
    }








})