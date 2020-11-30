$(function () {
    initList()
    // 一 获取文章分类列表
    function initList() {
        $.ajax({
            type: 'get',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！')
                }
                var html = template("tpl-table", res);
                $('tbody').html(html) //渲染文章分类列表结构
            }
        })
    }




    // 二 点添加类别按钮，弹出层出来
    var indexAdd = null;
    $('#tianjia').on("click", function () {
        // 弹出层
        indexAdd = layui.layer.open({ //open方法弹出 弹出层
            type: "1", // 弹出层类型：1号
            area: ['500px', '300px'], //[宽，高]
            title: '添加文章分类',
            content: $('#dialog-add').html() //获取 添加类别的弹出层 的结构
        });
    })


    // 三 (添加) 新增文章分类
    // 动态添加的form无法绑定事件  body代理form - add
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("新增加分类失败！")
                }
                initList() //重新获取列表数据
                layui.layer.msg("新增加分类成功！")
                // 关闭弹出层
                layui.layer.close(indexAdd) //// 打开弹出层会返一个索引，根据索引自动关闭对应的弹出层

            }
        })
    })




    // 四  点编辑按钮弹出层出来
    var indexEdit = null;
    $("tbody").on('click', '.btn-edit', function () {
        indexEdit = layui.layer.open({
            type: "1", // 页面层
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })


        // 五 编辑（修改） 
        // 根据id获取文章分类数据
        var id = $(this).attr('data-id');
        // 发请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('获取失败!')
                layui.form.val('form-edit', res.data)
            }
        })
    })


    // 六 根据Id  修改文章分类数据
    $('body').on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类数据失败')
                }
                layui.layer.msg("更新分类数据成功")
                layui.layer.close(indexEdit); //关闭弹出层
                initList()
            }
        })
    })




    // 七  删除  根据Id删除文章分类
    $("tbody").on("click", ".btn-delete", function () {
        // console.log(ok);
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layui.layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {

            $.ajax({
                type: 'get',
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类失败')
                    }
                    layui.layer.msg('删除分类成功')
                    layui.layer.close(index)
                    initList()
                }
            })
        })
    })
})