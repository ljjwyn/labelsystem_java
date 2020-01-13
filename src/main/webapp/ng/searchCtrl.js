/**
 * search_baike的控制器
 *
 * @author lijiajie
 */
indexApp
        .controller(
            'searchCtrl',
            function($scope, $http, $timeout,$interval) {
                $scope.url="http://127.0.0.1:3001/";
                //$scope.url="http://119.167.221.16:23000/";
                function getCookie(name) {
                    var arr=document.cookie.split('; ');
                    for(var i = 0 ; i < arr.length; i ++){
                        var arr2=arr[i].split('=');
                        if(arr2[0]==name){
                            return arr2[1];
                        }
                    }
                    return '';
                }
                $scope.getAndSearch=function(e){
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13) {
                        console.log("keywords",$scope.keywords);
                        $scope.searchKeywords();
                        $scope.fuzzySearch()
                    }
                };
                $scope.entityName=null;
                $scope.entityName = getCookie("entityName");
                $scope.searchRequest={
                    'keywords':null
                };
                $scope.keywords=null;
                $scope.keywordsList=null;
                $scope.keywordsList1=[1,2,3];
                $scope.currentPage=1;
                $scope.searchKeywords=function () {
                    $scope.searchRequest.keywords=$scope.keywords;
                    console.log("keys",$scope.searchRequest);
                    $http({
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                        },
                        url : $scope.url+'searchKeywords',
                        data : $scope.searchRequest
                    }).then(function(resp, status) {
                        $scope.keywordsList = resp.data;
                        $scope.keywordsLength= $scope.keywordsList.length;
                        $scope.pageSize = Math.ceil($scope.keywordsLength/10);
                        console.log($scope.pageSize);
                        $scope.pageList=[];
                        for(var i=1;i<=$scope.pageSize;i++){
                            $scope.pageList.push(i);
                        }
                        $scope.changPage(1);
                        console.log("list",$scope.keywordsList);
                        $scope.status = status;
                    }, function(resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                };
                $scope.changPage=function(targetPage){
                    $scope.currentPage = targetPage;
                    $scope.pagedKeyWordsList=[];
                    if($scope.keywordsLength-(targetPage-1)*10>10){
                        for(var i=(targetPage-1)*10;i<targetPage*10;i++){
                            $scope.pagedKeyWordsList.push($scope.keywordsList[i]);
                        }
                    }else {
                        for(var i=(targetPage-1)*10;i<$scope.keywordsLength;i++){
                            $scope.pagedKeyWordsList.push($scope.keywordsList[i]);
                        }
                    }
                    console.log("$scope.pagedKeyWordsList", $scope.pagedKeyWordsList);
                };
                $scope.changPageS=function(){
                    var targetPage = $scope.currentPage+1;
                    if(targetPage>$scope.pageSize){
                        swal.fire({
                            title:"最后一页",
                            timer:2000
                        })
                    }else {
                        $scope.changPage(targetPage);
                    }
                };
                $scope.changPageE=function(){
                    var targetPage = $scope.currentPage-1;
                    console.log("targetPage",targetPage);
                    if(targetPage<=0){
                        swal.fire({
                            title:"当前一页",
                            timer:2000
                        })
                    }else {
                        $scope.changPage(targetPage);
                    }
                };
                $scope.intoItem=function (item) {
                    document.cookie="ID="+item.ID;
                    console.log("ID",item.ID);
                    window.open("itemInfo.html");
                };
                if($scope.entityName!=''){
                    $scope.keywords=$scope.entityName;
                    console.log("$scope.keywords",$scope.keywords);
                    $scope.searchKeywords();
                }
                console.log("entityName",$scope.entityName);
                $scope.loadGraph=function(){
                    $scope.searchEntityInfo();
                };
                $scope.fuzzySearch = function(){
                    $http({
                        method: 'POST',
                        url: $scope.url+'fuzzysearch',
                        data: {
                            "searchContent":$scope.keywords
                        }
                    }).then(function (resp, status) {
                        console.log(resp.data);
                        if(resp.data['state']==1){
                            $scope.fuzzyEntityList=resp.data['entityList'];
                            // $scope.searchEntityInfo($scope.fuzzyEntityList[0]);
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
                $scope.searchRelation = function(entity){
                    $scope.currentEntity = entity;
                    $scope.keywords = entity;

                    $scope.searchKeywords();
                };
                $scope.searchEntityInfo=function(){
                    $http({
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                        },
                        url : $scope.url+'searchentityinfo',
                        data:{
                            "searchContent":$scope.keywords,
                            "deep":2
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
                                if(entityList[i]["entity"]==$scope.keywords){
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
                $scope.searchResShow=true;
                $scope.graphResShow=false;
                $scope.isactive1="nav-link active";
                $scope.isactive2="nav-link";
                $scope.showSearchRes = function () {
                    $scope.searchResShow=true;
                    $scope.graphResShow=false;
                    $scope.isactive1="nav-link active";
                    $scope.isactive2="nav-link";
                };
                $scope.showGraphRes = function () {
                    $scope.searchResShow=false;
                    $scope.graphResShow=true;
                    $scope.isactive1="nav-link";
                    $scope.isactive2="nav-link active";

                }
            });