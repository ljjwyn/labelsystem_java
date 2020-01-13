indexApp.controller('kgCtrl', function ($scope, $http, $interval) {
    $scope.url = "http://127.0.0.1:3001/";
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
    $scope.searchtest='';
    $scope.testform=function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13) {
            console.log("searchtest",$scope.searchtest);
            document.cookie="entityName="+$scope.searchtest;
            window.open("pages-search.html");
        }
    };
    $scope.userName = getCookie("userName");
    $scope.userId = getCookie("userId");
    $scope.lineStr = "";
    $scope.selectedDataSet=undefined;
    $scope.getLinerMethod="";
    function recordLabeledNum(){
        $http({
            method: 'POST',
            url: 'datasetuser/updatenum',
            data: {
                "dataSetId":$scope.selectedDataSet.id,
                "userId":$scope.userId
            }
        }).then(function (resp, status) {
            console.log(resp.data);
            $scope.status = status;
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };
    $scope.getLineStr=function(){
        $scope.getLinerMethod="数据集顺序提取";
        $http({
            method: 'POST',
            url: $scope.url+'getsentence',
            data: {
                "dataSetId":$scope.selectedDataSet.id,
                "userId":$scope.userId
            }
        }).then(function (resp, status) {
            console.log(resp.data);
            $scope.lineStr = resp.data['sentence'];
            $scope.IDnum = resp.data['ID'];
            $scope.currentCount = resp.data['ID'];
            $scope.sumCount = '';
            $scope.searchParam='';
            $scope.status = status;
            recordLabeledNum();
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };
    $scope.initDataSet=function(){
        $http({
            method: 'POST',
            url: 'labeldataset/getalldataset',
            data: {"userId":$scope.userId}
        }).then(function (resp, status) {
            console.log(resp.data);
            $scope.dataSetList = resp.data;
            $scope.status = status;
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };
    $scope.initDataSet();
    $scope.loadDataSet=function(){
        $http({
            method: 'POST',
            url: $scope.url+'checkdataset',
            data: {
                "userId": $scope.userId,
                "dataSetId":$scope.selectedDataSet.id
            }
        }).then(function (resp, status) {
            console.log(resp.data);
            var flag = resp.data['isDataBase'];
            if(flag==1){
                console.log("selectedDataSet", $scope.selectedDataSet);
                getAllLabelSetting(1);
                $scope.getLineStr();
            }else {
                swal.fire({
                    title:"您未初始化训练数据集\n请在【标注集管理】栏初始化数据集",
                    timer:5000
                })
            }
            $scope.status = status;
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };

    $scope.nWord='';
    $scope.wordSegment = function () {
        console.log($scope.lineStr);

        if (!$scope.lineStr) {
            return
        }

        $http({
            method: 'POST',
            url: 'api/kg/wordsegment', // 空字符串避免Thymeleaf表达式提示报错
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json',
            },
            data: {"contents":$scope.lineStr,"entity":''}
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.wordSegmentResult = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.addEntities=function(){
        var nWord = document.getElementById('nWord').value;
        console.log("nWord",nWord);
        $http({
            method: 'POST',
            url: 'api/kg/wordsegment', // 空字符串避免Thymeleaf表达式提示报错
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json',
            },
            data: {"contents":$scope.lineStr,
                    "entity":nWord}
        }).then(function (resp, status) {
            console.log(resp.data);
            $scope.wordSegmentResult = resp.data;
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };
    $scope.rebuildSentence=function(){
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
                        "dataSetName":$scope.selectedDataSet.dataSetName,
                        "dataSetColName":$scope.selectedDataSet.dataSetColName,
                        "dataSetId":$scope.selectedDataSet.id,
                        "userId":$scope.userId
                    }
                }).then(function (resp, status) {
                    $http({
                        method: 'POST',
                        url: 'datasetuser/getdatasetinfo',
                        data: {
                            "dataSetId":$scope.selectedDataSet.id,
                            "userId": $scope.userId
                        }
                    }).then(function (resp, status) {
                        console.log(resp.data);
                        if(resp.data.id==null){
                            $http({
                                method: 'POST',
                                url: 'datasetuser/insertrecord',
                                data: {
                                    "dataSetId":$scope.selectedDataSet.id,
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
                                    "dataSetId":$scope.selectedDataSet.id,
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
                    $scope.initDataSet();
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
    $scope.searchParam = '';
    $scope.searchContent=function(){
        $scope.getLinerMethod="基于主题词";
        console.log("searchParam", $scope.searchParam);
        $http({
            method: 'POST',
            url: $scope.url+'searchcontext',
            data:{
                "content": $scope.searchParam,
                "dataSetId":$scope.selectedDataSet.id,
                "userId":$scope.userId
            }
        }).then(function (resp, status) {
            console.log(resp.data);
            $scope.currentCount = resp.data['currentNum'];
            $scope.sumCount = resp.data['sumCount'];
            $scope.lineStr = resp.data['sentence'];
            $scope.IDnum = resp.data['ID'];
            $scope.status = status;
            recordLabeledNum();
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };

    /* ***************** */


    $scope.entityAttrCategories = [ // 实体属性类别列表
        '选择实体属性类别...'
    ];
    $scope.entityToEntityCategories = [ // 实体属性类别列表
        '选择实体与实体关系类别...'
    ];

    $scope.entityToRelationCategories = [ // 实体关系类别列表
        '选择实体与属性关系类别...'
    ];
    function unique1(arr){
        var hash=[];
        for (var i = 0; i < arr.length; i++) {
            if(hash.indexOf(arr[i])==-1){
                hash.push(arr[i]);
            }
        }
        return hash;
    }
    $scope.entityName = '';
    $scope.getEntity=function(word){
        $scope.entityName=word.word;
        console.log("$scope.entityName",$scope.entityName);
    };
    $scope.getEntityInfo=function(){
        document.cookie="entityName="+$scope.entityName;
        window.open("pages-search.html");
    };
    $scope.selectedAttrCategory=$scope.entityAttrCategories[0];
    $scope.entityList=["选择实体..."];
    $scope.attributeList=["选择属性值..."];
    $scope.isSelectEntityList = [];
    $scope.saveEntity=function(){
        $scope.isSelectEntityList.push($scope.entityName);
        console.log("selectedAttrCategory",$scope.selectedAttrCategory);
        swal({
            title: '是否确认\n实体：'+$scope.entityName+"\n类别："+$scope.selectedAttrCategory,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        }).then(function(isConfirm) {
            console.log("ic", isConfirm);
            if (isConfirm.value) {
                if($scope.selectedAttrCategory == "选择实体属性类别..."){
                    Swal("未选择类别，请重试");
                }else {
                    if ($scope.selectedAttrCategory == "属性值") {
                        $scope.attributeList.push($scope.entityName);
                    } else {
                        $scope.entityList.push($scope.entityName);
                    }
                    $http({
                        method: 'POST',
                        url: $scope.url+'recordentity',
                        data:{
                            "entity":$scope.entityName,
                            "entityType":$scope.selectedAttrCategory,
                            "sentence":$scope.lineStr,
                            "dataSetId":$scope.selectedDataSet.id,
                            "userId":$scope.userId
                        }
                    }).then(function (resp, status) {
                        console.log(resp.data);
                        $scope.status = status;
                    }, function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                    console.log("$scope.attributeList", $scope.attributeList);
                    console.log("$scope.entityList", $scope.entityList);
                }
            }
        })

    };
    $scope.finishedEntity=function () {
        // 加个上传实体实体类别到后端
        //实体与属性值列表去重
        $scope.attributeList=unique1($scope.attributeList);
        $scope.entityList=unique1($scope.entityList);
        $scope.isShow=false;
    };
    $scope.entity1=$scope.entityList[0];
    $scope.entity2=$scope.entityList[0];
    $scope.entity3=$scope.entityList[0];
    $scope.selectedEntityToRelation=$scope.entityToRelationCategories[0];
    $scope.selectedEntityToEntity=$scope.entityToEntityCategories[0];
    $scope.attribute=$scope.attributeList[0];

    $scope.addEntityToRelation=function () {
        console.log("entity1",$scope.entity1);
        console.log("selectedEntityToRelation",$scope.selectedEntityToRelation);
        console.log("attribute",$scope.attribute);
        swal({
            title: '是否确认\n实体：'+$scope.entity1+"\n关系："+$scope.selectedEntityToRelation
            +"\n属性值："+$scope.attribute,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        }).then(function(isConfirm) {
            console.log("ic", isConfirm);
            if (isConfirm.value) {
                if($scope.selectedEntityToRelation == "选择实体与属性关系类别..."){
                    Swal("未选择类别，请重试");
                }else {
                    var resMap={
                        "entity1":$scope.entity1,
                        "relation":$scope.selectedEntityToRelation,
                        "entity2":$scope.attribute,
                        "sentence":$scope.lineStr,
                        "dataSetId":$scope.selectedDataSet.id,
                        "userId":$scope.userId
                    };
                    $http({
                        method: 'POST',
                        url: $scope.url+'recordrelation',
                        data:resMap
                    }).then(function (resp, status) {
                        console.log(resp.data);
                        $scope.status = status;
                    }, function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                    console.log("resMap",resMap);
                }
            }
        })
    };

    $scope.addEntityToEntity=function () {
        console.log("entity2",$scope.entity2);
        console.log("selectedEntityToEntity",$scope.selectedEntityToEntity);
        console.log("entity3",$scope.entity3);
        swal({
            title: '是否确认\n实体：'+$scope.entity2+"\n关系："+$scope.selectedEntityToEntity
                +"\n实体："+$scope.entity3,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        }).then(function(isConfirm) {
            console.log("ic", isConfirm);
            if (isConfirm.value) {
                if($scope.selectedEntityToEntity == "选择实体与实体关系类别..."){
                    Swal("未选择类别，请重试");
                }else {
                    var resMap={
                        "entity1":$scope.entity2,
                        "relation":$scope.selectedEntityToEntity,
                        "entity2":$scope.entity3,
                        "sentence":$scope.lineStr,
                        "dataSetId":$scope.selectedDataSet.id,
                        "userId":$scope.userId
                    };
                    $http({
                        method: 'POST',
                        url: $scope.url+'recordrelation',
                        data:resMap
                    }).then(function (resp, status) {
                        console.log(resp.data);
                        $scope.status = status;
                    }, function (resp, status) {
                        $scope.resp = resp;
                        $scope.status = status;
                    });
                    console.log("resMap",resMap);
                }
            }
        })
    };
    $scope.finishAndContinue=function () {
        $scope.entityList=["选择实体..."];
        $scope.attributeList=["选择属性值..."];
        $scope.entity1=$scope.entityList[0];
        $scope.entity2=$scope.entityList[0];
        $scope.entity3=$scope.entityList[0];
        $scope.selectedEntityToRelation=$scope.entityToRelationCategories[0];
        $scope.selectedEntityToEntity=$scope.entityToEntityCategories[0];
        $scope.attribute=$scope.attributeList[0];
        if($scope.searchParam!=''){
            $scope.searchContent();
        }else {
            $scope.getLineStr();
        }
        swal.fire({
            title: '完成！继续下一条文本',
            timer: 2000
        });
    };
    $scope.labelTabelShow=false;
    $scope.labelFlag = 0;
    $scope.setLabelName='';
    $scope.setLabelDes='';
    function getAllLabelSetting(flag) {
        $scope.entityAttrCategories = [ // 实体属性类别列表
            '选择实体属性类别...'
        ];
        $scope.entityToEntityCategories = [ // 实体属性类别列表
            '选择实体与实体关系类别...'
        ];

        $scope.entityToRelationCategories = [ // 实体关系类别列表
            '选择实体与属性关系类别...'
        ];
        $http({
            method: 'GET',
            url: 'kg/getallsetting'
        }).then(function (resp, status) {
            console.log(resp.data);
            $scope.labelList = [];
            var resList=resp.data;
            for(var i=0;i<resList.length;i++){
                if(resList[i]['labelFlag']==flag){
                    $scope.labelList.push(resList[i]);
                }
                if(resList[i]['labelFlag']==1){
                    $scope.entityAttrCategories.push(resList[i]['labelName'])
                }
                if(resList[i]['labelFlag']==2){
                    $scope.entityToEntityCategories.push(resList[i]['labelName'])
                }
                if(resList[i]['labelFlag']==3){
                    $scope.entityToRelationCategories.push(resList[i]['labelName'])
                }
            }
            console.log("$scope.labelList",$scope.labelList);
            $scope.status = status;
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };
    $scope.showEntityTpye=function () {
        getAllLabelSetting(1);
        $scope.labelFlag = 1;
        $scope.labelTabelShow=true;
    };
    $scope.showEntityCategories=function () {
        getAllLabelSetting(2);
        $scope.labelFlag = 2;
        $scope.labelTabelShow=true;
    };
    $scope.showEntityEntity=function () {
        getAllLabelSetting(3);
        $scope.labelFlag = 3;
        $scope.labelTabelShow=true;
    };
    $scope.saveLabel=function () {
        console.log("$scope.labelFlag",$scope.labelFlag);
        console.log("$scope.setLabelName",$scope.setLabelName);
        console.log("$scope.setLabelDes",$scope.setLabelDes);
        $http({
            method: 'POST',
            url: 'kg/insert',
            data:{
                "labelName":$scope.setLabelName,
                "labelDes":$scope.setLabelDes,
                "labelFlag":$scope.labelFlag
            }
        }).then(function (resp, status) {
            console.log(resp.data);
            getAllLabelSetting($scope.labelFlag);
            $scope.status = status;
        }, function (resp, status) {
            $scope.resp = resp;
            $scope.status = status;
        });
    };
    $scope.deleteSetting=function (label) {
        console.log("label",label);
        if(label.labelName=="属性值"){
            swal.fire({
                title: '属性值标签不可删除',
                timer: 2000
            });
        }else {
            $http({
                method: 'POST',
                url: 'kg/delete',
                data:{
                    "id":label.id
                }
            }).then(function (resp, status) {
                console.log(resp.data);
                getAllLabelSetting($scope.labelFlag);
                $scope.status = status;
            }, function (resp, status) {
                $scope.resp = resp;
                $scope.status = status;
            });
        }
    };
    $scope.disableLabelSetting=function () {
        $scope.labelTabelShow=false;
    };
    $scope.segResShow=true;
    $scope.isactive1="nav-link active";
    $scope.isactive2="nav-link";
    $scope.isactive3="nav-link active";
    $scope.isactive4="nav-link";
    $scope.isactive5="nav-link active";
    $scope.isactive6="nav-link";
    $scope.entityBuildShow=true;
    $scope.entityLabelShow=false;
    $scope.categoriesBuildShow=true;
    $scope.categoriesLabelShow=false;
    $scope.showSegRes=function () {
        $scope.segResShow=true;
        $scope.labelTabelShow=false;
        $scope.isactive1="nav-link active";
        $scope.isactive2="nav-link";
    };
    $scope.showEntitySet=function () {
        getAllLabelSetting(1);
        $scope.labelFlag = 1;
        $scope.segResShow=false;
        $scope.labelTabelShow=true;
        $scope.isactive1="nav-link";
        $scope.isactive2="nav-link active";
    };
    $scope.showEntityBuild=function () {
        $scope.isactive3="nav-link active";
        $scope.isactive4="nav-link";
        $scope.entityBuildShow=true;
        $scope.entityLabelShow=false;
    };
    $scope.showLabelSet=function () {
        getAllLabelSetting(3);
        $scope.labelFlag = 3;
        $scope.isactive3="nav-link";
        $scope.isactive4="nav-link active";
        $scope.entityBuildShow=false;
        $scope.entityLabelShow=true;
    };

    $scope.showCategoriesBuild=function () {
        $scope.isactive5="nav-link active";
        $scope.isactive6="nav-link";
        $scope.categoriesBuildShow=true;
        $scope.categoriesLabelShow=false;
    };
    $scope.showCategoriesLabelSet=function () {
        getAllLabelSetting(2);
        $scope.labelFlag = 2;
        $scope.isactive5="nav-link";
        $scope.isactive6="nav-link active";
        $scope.categoriesBuildShow=false;
        $scope.categoriesLabelShow=true;
    }

});