$(function () {
    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} / ${hh}:${mm}:${ss}`
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }


    // 一 查询参数 --对象q   请求数据将q对象提交到服务器
    var q = {
        pagenum: 1, //页码值， 请求第一页的数据
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' ///文章的状态，可选值有：已发布、草稿
    };




    initTable()
    initCate()
    // 二 获取文章列表数据
    function initTable() {
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章列表数据失败！")
                }
                // 用模板引擎渲染数据
                var html = template('tpl-table', res)
                $('tbody').html(html)
                // 调用渲染分页
                renderPage(res.total)
            }
        })
    }




    // 三 初始化文章分类
    function initCate() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取分类数据失败!")
                }
                // 模板引擎渲染分类的可选项
                var html = template("tpl-cate", res)
                console.log(html);
                $('[name=cate_id]').html(html)
                // 通知layui重新渲染
                layui.form.render()
            }
        })
    }


    //筛选表单
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 为查询对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })




    // 渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render方法来渲染分页的结构
        layui.laypage.render({
            elem: 'pageBox', //分页容器的Id   这里的ID，不用加 # 号
            count: total, //总数据条数   
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中哪一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页功能项
            limits: [2, 3, 5, 10], //自定义每页展示多少条
            // 分页发生切换的时候，触发 jump回调(是layui的方法)
            jump: function (obj, first) {
                q.pagenum = obj.curr //最新页码值赋值给查询参数对象
                q.pagesize = obj.limit // 把最新的条目数，赋值到q(查询对象)的pagesize 属性中

                if (!first) {
                    initTable()
                }
            }
        })
    }


    //删除文章
    // 删除按钮是动态生成的，用事件委托
    $("tbody").on("click", '.btn-delete', function () {
        //  获取删除按钮的个数
        var len=$(".btn-delete").length
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {

            $.ajax({
                type: "get",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("删除文章失败！")
                    }
                    layui.layer.msg("删除文章成功！")
                    // 当数据删除完成之后 ,要判断当前这一页中，是否还有剩余的数据，如果没有则让页码值 -1 之后，再重新调用 initTable()
                    if (len === 1) {
                        // len的值等于1，证明删除完毕之后页面上就没数据了
                        // 页码值最小是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})