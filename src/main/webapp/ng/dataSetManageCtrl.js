/**
 * search_baike的控制器
 *
 * @author lijiajie
 */
indexApp
    .controller(
        'dataSetManageCtrl',
        function($scope, $http, $timeout,$interval) {
            $scope.url= "http://127.0.0.1:3001/";
            //$scope.url="http://119.167.221.16:23000/";
            function getCookie(name) {
                var arr=document.cookie.split('; ');
                console.log("arr", arr);
                for(var i = 0 ; i < arr.length; i ++){
                    var arr2=arr[i].split('=');
                    if(arr2[0]==name){
                        return arr2[1];
                    }
                }
                return '';
            }
            $scope.userName = getCookie("userName");
            $scope.userId = getCookie("userId");
            $scope.getAllDataSet=function () {
                $http({
                    method: 'POST',
                    url: 'labeldataset/getalldataset',
                    data: {
                        "userId":$scope.userId
                    }
                }).then(function (resp, status) {
                    console.log(resp.data);
                    $scope.labelDataSetList = resp.data;
                    $scope.status = status;
                }, function (resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.labeledInfoShow=false;
            $scope.showDataSetInfo=function (task) {
                $scope.currentTask = task;
                console.log(task);
                $scope.labeledInfoShow=true;
            };
            $scope.rebuildSentence=function(task){
                swal({
                    title: "是否重构数据集\n初始化所有测试文本",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消'
                }).then(function(isConfirm) {
                    console.log("ic", isConfirm);
                    if (isConfirm.value) {
                        Swal({
                            title: "重构测试集中......",
                            showConfirmButton: false,
                            showCancelButton: false,
                            showLoaderOnConfirm: true,
                        });
                        $http({
                            method: 'POST',
                            url: $scope.url+'rebuilddataset',
                            data: {
                                "dataSetName":task.dataSetName,
                                "dataSetColName":task.dataSetColName,
                                "dataSetId":task.id,
                                "userId":$scope.userId
                            }
                        }).then(function (resp, status) {
                            $http({
                                method: 'POST',
                                url: 'datasetuser/getdatasetinfo',
                                data: {
                                    "dataSetId":task.id,
                                    "userId": $scope.userId
                                }
                            }).then(function (resp, status) {
                                console.log(resp.data);
                                if(resp.data.id==null){
                                    $http({
                                        method: 'POST',
                                        url: 'datasetuser/insertrecord',
                                        data: {
                                            "dataSetId":task.id,
                                            "userId": $scope.userId
                                        }
                                    }).then(function (resp, status) {
                                        swal.fire({
                                            title: "初次使用系统，创建用户记录",
                                            timer:2000
                                        });
                                        console.log(resp.data);
                                        $scope.status = status;
                                    }, function (resp, status) {
                                        $scope.resp = resp;
                                        $scope.status = status;
                                    });
                                }else {
                                    $http({
                                        method: 'POST',
                                        url: 'datasetuser/initrecord',
                                        data: {
                                            "dataSetId":task.id,
                                            "userId": $scope.userId
                                        }
                                    }).then(function (resp, status) {
                                        swal.fire({
                                            title: "初始化用户记录",
                                            timer:2000
                                        });
                                        console.log(resp.data);
                                        $scope.status = status;
                                    }, function (resp, status) {
                                        $scope.resp = resp;
                                        $scope.status = status;
                                    });
                                }
                                $scope.status = status;
                            }, function (resp, status) {
                                $scope.resp = resp;
                                $scope.status = status;
                            });
                            $scope.getAllDataSet();
                            swal.fire({
                                title: '完成！',
                                timer: 2000
                            });
                            console.log(resp.data);
                            $scope.status = status;
                        }, function (resp, status) {
                            $scope.resp = resp;
                            $scope.status = status;
                        });
                    }
                })
            };
            $scope.knowledgeGraphShow=false;
            $scope.downloadShow=false;
            $scope.showKnowledgeGraph=function(){
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'getlabeledinfo',
                    data:{
                        "dataSetId":$scope.currentTask.id,
                        "userId":$scope.userId
                    }
                }).then(function(resp, status) {
                    echarts.init(document.getElementById('knowledgeGraph')).dispose();
                    console.log(resp.data);
                    var entityList=resp.data["entityList"];
                    var relationList=resp.data["relationList"];
                    var categories=resp.data["categories"];
                    $scope.entityMapsList=[];
                    $scope.relationList=[];
                    $scope.categoriesList=[];
                    $scope.graphInfo="实体关系详情\n";
                    $scope.graphInfo+="实体属性：\n";
                    for(var i=0;i<categories.length;i++){
                        var tempMap = {
                            "name":categories[i]
                        };
                        $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                        $scope.categoriesList.push(tempMap);
                    }
                    $scope.graphInfo+="实体列表：\n";
                    for(var i=0;i<entityList.length;i++){
                        var tempMap = {
                            "name":entityList[i]["entity"],
                            "des":entityList[i]["entity"],
                            "symbolSize": 50,
                            "category":entityList[i]["entity_type"]
                        };
                        $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                        $scope.entityMapsList.push(tempMap);
                    }
                    $scope.graphInfo+="关系列表：\n";
                    for(var j=0;j<relationList.length;j++){
                        var tempMap = {
                            "source":relationList[j]["entity1"],
                            "target":relationList[j]["entity2"],
                            "name": relationList[j]["relation"],
                            "des":relationList[j]["relation"]
                        };
                        $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                        $scope.relationList.push(tempMap);
                    }
                    console.log("categoriesList",$scope.categoriesList);
                    console.log("entityMapsList",$scope.entityMapsList);
                    console.log("$scope.relationList",$scope.relationList);
                    $scope.getKnowledgeGraph();
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.searchDeep=[1,2,3,4];
            $scope.fuzzySearch = function(){
                $http({
                    method: 'POST',
                    url: $scope.url+'fuzzysearch',
                    data: {
                        "searchContent":$scope.searchContent
                    }
                }).then(function (resp, status) {
                    console.log(resp.data);
                    if(resp.data['state']==1){
                        $scope.fuzzyEntityList=resp.data['entityList'];
                        $scope.searchEntityInfo($scope.fuzzyEntityList[0]);
                    }else {
                        swal.fire({
                            title:"无关联词",
                            timer:2000
                        })
                    }
                    $scope.status = status;
                }, function (resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.searchEntityInfo=function(entityName){
                $scope.currentEntity = entityName;
                var myselect=document.getElementById("configselect");
                var index=myselect.selectedIndex;
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'searchentityinfo',
                    data:{
                        "searchContent":entityName,
                        "deep":$scope.searchDeep[index]
                    }
                }).then(function(resp, status) {
                    echarts.init(document.getElementById('knowledgeGraph')).dispose();
                    console.log(resp.data);
                    if(resp.data['state']==1){
                        var entityList=resp.data["entityList"];
                        var relationList=resp.data["relationList"];
                        var categories=resp.data["categories"];
                        $scope.entityMapsList=[];
                        $scope.relationList=[];
                        $scope.categoriesList=[];
                        $scope.graphInfo="实体关系详情\n";
                        $scope.graphInfo+="实体属性：\n";
                        for(var i=0;i<categories.length;i++){
                            var tempMap = {
                                "name":categories[i]
                            };
                            $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                            $scope.categoriesList.push(tempMap);
                        }
                        $scope.graphInfo+="实体列表：\n";
                        for(var i=0;i<entityList.length;i++){
                            if(entityList[i]["entity"]==$scope.searchEntity){
                                var tempMap = {
                                    "name":entityList[i]["entity"],
                                    "des":entityList[i]["entity"],
                                    "symbolSize": 80,
                                    "category":entityList[i]["entity_type"]
                                };
                            }else {
                                var tempMap = {
                                    "name":entityList[i]["entity"],
                                    "des":entityList[i]["entity"],
                                    "symbolSize": 50,
                                    "category":entityList[i]["entity_type"]
                                };
                            }
                            $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                            $scope.entityMapsList.push(tempMap);
                        }
                        $scope.graphInfo+="关系列表：\n";
                        for(var j=0;j<relationList.length;j++){
                            var tempMap = {
                                "source":relationList[j]["entity1"],
                                "target":relationList[j]["entity2"],
                                "name": relationList[j]["relation"],
                                "des":relationList[j]["relation"]
                            };
                            $scope.graphInfo+=JSON.stringify(tempMap)+"\n";
                            $scope.relationList.push(tempMap);
                        }
                        console.log("categoriesList",$scope.categoriesList);
                        console.log("entityMapsList",$scope.entityMapsList);
                        console.log("$scope.relationList",$scope.relationList);
                        $scope.getKnowledgeGraph();
                    }else {
                        swal.fire({
                            title:"查无此实体！",
                            timer:2000
                        })
                    }
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };

            $scope.disableKnowledgeGraph=function(){
                $scope.knowledgeGraphShow=false;
            };
            $scope.knowledgeGraph=function(){
                if($scope.knowledgeGraphShow==false){
                    $scope.knowledgeGraphShow=true;
                }else {
                    $scope.knowledgeGraphShow=false;
                }
            };
            $scope.downloadShowCtrl=function(){
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'createdataset',
                    data:{
                        "dataSetId":$scope.currentTask.id,
                        "userId":$scope.userId
                    }
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.REData=resp.data['contents'];
                    $scope.relationType=resp.data['relation'];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
                if($scope.downloadShow==false){
                    $scope.downloadShow=true;
                }else {
                    $scope.downloadShow=false;
                }
            };
            $scope.downloadDataSet=function(){
                window.location.href="labeldataset/download";
            };
            $scope.downloadClass=function(){
                window.location.href="labeldataset/downloadclass";
            };

            //echart画图
            $scope.getKnowledgeGraph=function(){
                var myChart = echarts.init(document.getElementById('knowledgeGraph'));
                var categories = [];
                for (var i = 0; i < 2; i++) {
                    categories[i] = {
                        name: '测试'
                    };
                }
                console.log("entityMapsList1",$scope.entityMapsList);
                console.log("$scope.relationList",$scope.relationList);
                var option = {
                    // 图的标题
                    title: {
                        text: '预测集关系图谱'
                    },
                    // 提示框的配置
                    tooltip: {
                        formatter: function (x) {
                            return x.data.des;
                        }
                    },
                    // 工具箱
                    toolbox: {
                        // 显示工具箱
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            // 还原
                            restore: {
                                show: true
                            },
                            // 保存为图片
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    legend: [{
                        // selectedMode: 'single',
                        data: $scope.categoriesList.map(function (a) {
                            return a.name;
                        })
                    }],
                    series: [{
                        type: 'graph', // 类型:关系图
                        layout: 'force', //图的布局，类型为力导图
                        symbolSize: 40, // 调整节点的大小
                        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [2, 10],
                        edgeLabel: {
                            normal: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        force: {
                            repulsion: 2500,
                            edgeLength: [10, 50]
                        },
                        draggable: true,
                        lineStyle: {
                            normal: {
                                width: 2,
                                color: '#4b565b',
                            }
                        },
                        edgeLabel: {
                            normal: {
                                show: true,
                                formatter: function (x) {
                                    return x.data.name;
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                textStyle: {}
                            }
                        },

                        // 数据
                        data: $scope.entityMapsList,
                        links: $scope.relationList,
                        categories: $scope.categoriesList
                    }]
                };
                myChart.setOption(option,true);
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            };
            $scope.searchtest='';
            $scope.testform=function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13) {
                    console.log("searchtest",$scope.searchtest);
                    document.cookie="entityName="+$scope.searchtest;
                    window.open("pages-search.html");
                }
            };
        });