$(function() {

    "use strict";
    events();
    render();

    function events() {
        $("#search-btn").on("click", function(err) {
            var dept = $("#select-dept").find("option:selected").text();
            var office = $("#select-office").find("option:selected").text();
            var name = $("#select-name").find("option:selected").text();
            if(dept === ' -- 请选择 -- ') {
                dept = '';
            }
            if(office === ' -- 请选择 -- ') {
                office = '';
            }
            if(name === ' -- 请选择 -- ') {
                name = '';
            }
            filterColumn( dept, office, name );//部门，组/办，姓名
        });
    }

    function filterColumn ( t1, t2, t3) {

        //部门
        $('#example').DataTable().column( 36 ).search(
            t1
        ).draw();

        //组/办-办事处  ***
        $('#example').DataTable().column( 35 ).search(
            t2
        ).draw();

        //姓名
        $('#example').DataTable().column( 4 ).search(
            t3
        ).draw();
    }

    function render() {

        /**
         * 加载数据
         */
        $('#example thead th[colspan]').wrapInner( '<span/>' ).append( '&nbsp;' );

        // Standard initialisation
        var table =  $('#example').DataTable( {
            "iDisplayLength": 15,
            dom:            "Cfrtip",
            scrollY:        "600px",
            scrollX:        true,
            scrollCollapse: true,
            paging:         true,
            "bPaginate": true,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": true,//搜索栏
            "bSort": false,//排序
            "bInfo": true,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": true,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'search': '检索:',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'paginate': {
                    'first':      '第一页',
                    'last':       '最后一页',
                    'next':       '',
                    'previous':   ''
                },
                //'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
                'info': '',
                'infoEmpty': '没有数据',
                'infoFiltered': '(过滤总件数 _MAX_ 条)'
            },
            responsive: true,
            "sAjaxSource": "/performance/getEmpPerformanceForHrInfo",     //指定要从哪个URL获取数据
            "fnInitComplete": function(oSettings, json) {
                //alert("成功!");
            },
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                var start = 0,limit = 10,sSearch = "";
                var orgId = $("#hid-user").val();

                _.each(aoData, function(param) {
                    if ("iDisplayStart" ===param.name) {
                        start = param.value;
                    }
                    if ("iDisplayLength" ===param.name) {
                        limit = param.value;
                    }
                    if ("sSearch" ===param.name) {
                        sSearch = param.value;
                    }
                });

                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "data": {
                        keyword: sSearch,
                        skip: start,
                        limit: limit,
                        orgId: orgId
                    },

                    "success": function(json) {
                        //console.log("######json:",json);
                        var resultData = json.data;
                        var totalItems = 0;
                        if(json.data.length > 0){
                            totalItems = json.data.length;
                        }

                        fnCallback( {

                            iTotalRecords: totalItems          //json.data.totalItems
                            , iTotalDisplayRecords: totalItems //json.data.totalItems
                            , aaData: resultData

                        });
                    }
                });
            },
            "columns": [
                {"mData":"ROWNUM", "sDefaultContent": "","width":"20px"},//0.序号
                {"mData":"CDEPT", "sDefaultContent": "","width":"20px"},//1.部门
                {"mData":"CGROUP", "sDefaultContent": "","width":"20px"},//2.组/办
                {"mData":"CLEI", "sDefaultContent": "","width":"20px"},//3.归属类
                {"mData":"NAME", "sDefaultContent": "","width":"20px"},//4.姓名
                {"mData":"RANK", "sDefaultContent": "","width":"30px"},//5.职级
                {"mData":"CJBMONEY", "sDefaultContent": "","width":"20px"},//6.基本工资
                {"mData":"CGWMONEY", "sDefaultContent": "","width":"60px" },//7.岗位工资
                {"mData":"CXCMONEY", "sDefaultContent": "","width":"60px" },//8.现场津贴
                {"mData":"COTHERFOODMONEY", "sDefaultContent": "","width":"60px" },//9.其他餐补
                {"mData":"CZWMONEY", "sDefaultContent": "","width":"60px" },//10.驻外津贴
                {"mData":"CDQMONEY", "sDefaultContent": "","width":"60px" },//11.地区补差
                {"mData":"COTHERSUBSIDY", "sDefaultContent": "","width":"60px" },//12.其他补贴
                {"mData":"CJBMONEYSUM", "sDefaultContent": "","width":"20px"},//13.基本薪资总计

                {"mData":"CRANKSTANDARD", "sDefaultContent": "","width":"20px"},//14.职级/工资标准
                {"mData":"CRANKSUM", "sDefaultContent": "","width":"20px"},//15.职级工资总计
                {"mData":"CMONEYADD", "sDefaultContent": "","width":"20px"},//16.工资增加
                {"mData":"CMONTHMONEYADD", "sDefaultContent": "","width":"20px"},//17.月收入增加

                {"mData":"ENTRY_TIME", "sDefaultContent": "","width":"10px" },//18.入职日期
                {"mData":"POSITIVE_TIME", "sDefaultContent": "","width":"40px" },//19.转正日期
                {"mData":"REMARKS", "sDefaultContent": "","width":"40px"},//20.备注
                {"mData":"DEPARTURE_TIME", "sDefaultContent": "","width":"20px"},//21.离职日期

                {"mData":"PRE_AWARD", "sDefaultContent": "","width":"20px"},//22.二季度月奖金
                {"mData":"PRE_AWARD", "sDefaultContent": "","width":"20px"},//23.季度合计
                {"mData":{}, "sDefaultContent": "","width":"20px"},//24.月收入
                {"mData":"", "sDefaultContent": "","width":"20px"},//25.奖金环比
                {"mData":"", "sDefaultContent": "","width":"20px"},//26.月收入环比

                {"mData":"", "sDefaultContent": "","width":"30px"},//27.三季度总额奖金
                {"mData":"PROPORTION", "sDefaultContent": "","width":"20px"},//28.打分
                {"mData":"SUPERIORPRO", "sDefaultContent": "","width":"60px" },//29.调整后打分
                {"mData":"NOW_AWARD", "sDefaultContent": "","width":"60px"},//30.月奖金
                {"mData":"NOW_AWARD", "sDefaultContent": "","width":"10px" },//31.季度合计
                {"mData":{}, "sDefaultContent": "","width":"10px" },//32.月收入
                {"mData":{}, "sDefaultContent": "","width":"40px" },//33.奖金环比
                {"mData":{}, "sDefaultContent": "","width":"40px"},//34.月收入环比
                {"mData":"OFFICE_NAME", "sDefaultContent": "","width":"40px","class":"hidden"},//35.办事处
                {"mData":"COMPANY_NAME", "sDefaultContent": "","width":"40px","class":"hidden"}//36.部门

            ],
            "columnDefs": [
                {
                    "targets": [18],
                    "data": "入职日期",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            aa = moment(data).format("YYYY-MM-DD");
                        }
                        return aa;
                    }
                },
                {
                    "targets": [19],
                    "data": "转正日期",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            aa = moment(data).format("YYYY-MM-DD");
                        }
                        return aa;
                    }
                },
                {
                    "targets": [21],
                    "data": "离职日期",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            aa = moment(data).format("YYYY-MM-DD");
                        }
                        return aa;
                    }
                },
                {
                    "targets": [22],
                    "data": "上季度月奖金",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            aa = parseFloat(data/3).toFixed(2);
                        }
                        return aa;
                    }
                },
                {
                    "targets": [23],
                    "data": "上季度奖金合计",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            aa = data.toFixed(2);
                        }
                        return aa;
                    }
                },
                {
                    "targets": [24],
                    "data": "上季度月收入",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            if(data.PRE_CJBMONEYSUM === '' || data.PRE_CJBMONEYSUM === null){
                                data.PRE_CJBMONEYSUM = 0;
                            }
                            if(data.PRE_AWARD === '' || data.PRE_AWARD === null){
                                data.PRE_AWARD = 0;
                            }
                            aa = parseFloat(data.PRE_CJBMONEYSUM + (data.PRE_AWARD / 3)).toFixed(2);
                        }
                        return aa;
                    }
                },
                {
                    "targets": [30],
                    "data": "月奖金",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            aa = (data / 3).toFixed(2);
                        }
                        return aa;
                    }
                },
                {
                    "targets": [31],
                    "data": "季度合计",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            aa = data.toFixed(2);
                        }
                        return aa;
                    }
                },
                {
                    "targets": [32],
                    "data": "月收入",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--'
                        }else {
                            if(data.CJBMONEY === '' || data.CJBMONEY === null) {
                                data.CJBMONEY = 0;
                            }
                            if(data.NOW_AWARD === '' || data.NOW_AWARD === null) {
                                data.NOW_AWARD = 0;
                            }
                            //基本薪资总计＋月奖金
                            aa = parseFloat(data.CJBMONEYSUM + (data.NOW_AWARD / 3)).toFixed(2);
                        }
                        return aa;
                    }
                },
                {
                    "targets": [33],
                    "data": "奖金环比",
                    "render": function (data){
                        var aa,bb;
                        if (data) {
                            if (data.PRE_AWARD != null){
                                if(data.PRE_AWARD != 0) {
                                    aa = ((data.NOW_AWARD / 200) * 100).toFixed(2) + '%';
                                }else {
                                    aa = '--';
                                }
                            }else {
                                aa = '--';
                            }

                        } else {
                            aa = '--';
                        }
                        return aa;
                    }
                },
                {
                    "targets": [34],
                    "data": "月收入环比",
                    "render": function (data){
                        var aa;
                        if (data === '' || data === null) {
                            aa = '--';
                        }else {
                            //当前季度得月收入/上个季度得月收入
                            if(data.PRE_CJBMONEYSUM === 0 && data.PRE_AWARD === 0){
                                aa = '--';
                            }
                            if(data.CJBMONEYSUM === '' || data.CJBMONEYSUM === null) {
                                data.CJBMONEYSUM = 0;
                            }
                            if(data.NOW_AWARD === '' || data.NOW_AWARD === null) {
                                data.NOW_AWARD = 0;
                            }
                            if(data.PRE_CJBMONEYSUM === '' || data.PRE_CJBMONEYSUM === null) {
                                data.PRE_CJBMONEYSUM = 0;
                            }
                            if(data.PRE_AWARD === '' || data.PRE_AWARD === null) {
                                data.PRE_AWARD = 0;
                            }

                            aa = parseFloat((data.CJBMONEYSUM + (data.NOW_AWARD / 3)) / (data.PRE_CJBMONEYSUM + (data.PRE_AWARD / 3)) * 100).toFixed(2)+"%";

                            if(data.PRE_CJBMONEYSUM === 0 && data.PRE_AWARD === 0){
                                aa = '--';
                            }
                        }
                        return aa;
                    }
                }
            ]


        } );

        new $.fn.dataTable.FixedColumns( table, {
            leftColumns: 6
        } );

        /**
         * 获得检索的数据
         */
        light.doget("/performance/getSearchTable", function(err, result) {
            for(var i=0;i<result[0].length;i++){
                $("#select-dept").append("<option id='"+result[0][i].ID+"'>"+result[0][i].NAME+"</option>");
            }
            for(var i=0;i<result[1].length;i++){
                $("#select-office").append("<option id='"+result[1][i].ID+"'>"+result[1][i].NAME+"</option>");
            }
            for(var i=0;i<result[2].length;i++){
                $("#select-name").append("<option id='"+result[2][i].ID+"'>"+result[2][i].NAME+"</option>");
            }

            $('#select-dept').chosen();
            $('#select-office').chosen();
            $('#select-name').chosen();
        });
    }
});