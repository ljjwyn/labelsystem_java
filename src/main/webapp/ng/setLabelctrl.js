/**
 * itemInfo的控制器
 *
 * @author lijiajie
 */
indexApp
    .controller(
        'setLabels',
        function($scope, $http, $timeout,$interval) {
            $scope.url="http://127.0.0.1:3001/";
            //$scope.url="http://119.167.221.16:23000/";
            $scope.getItem=function () {
                $http({
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'noLabelItem'
                }).then(function(resp, status) {
                    $scope.itemInfo = resp.data;
                    $scope.contentList=$scope.itemInfo.content;
                    $scope.catalogList=$scope.itemInfo.catalog;
                    $scope.summarys=$scope.itemInfo.summary;
                    $scope.title=$scope.itemInfo.title;
                    $scope.imgUrl=$scope.itemInfo.imgUrl;
                    $scope.ID=$scope.itemInfo.ID;
                    var listLen=$scope.catalogList.length;
                    $scope.indexList=[]
                    for(var i=0;i<listLen;i++){
                        $scope.indexList.push(i);
                    }
                    console.log("$scope.itemInfo",$scope.itemInfo);
                    console.log("$scope.contentList",$scope.contentList);
                    console.log("$scope.catalogList",$scope.catalogList);
                    $scope.status = status;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.getItem();
            /**
             * labelItem的相关函数
             * @param flage
             */
            $scope.labelRequest={
                entity:null,
                label:null,
                ID:null
            };
            var flages=true;
            $scope.chooseLabel=function (flage,id) {
                console.log(id);
                console.log(flages);
                $(eval(id)).attr("checked",flages);
                flages = !flages;
                console.log("flage",flage);
                $scope.labelRequest.label = flage;
                $scope.labelRequest.entity = $scope.title;
                $scope.labelRequest.ID = $scope.ID;
            };

            $scope.updateKeys = function($event, id) {
                console.log("event", id);
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                console.log(checkbox,action);
                if(action=='add'){
                    $scope.labelRequest.label = id;
                    $scope.labelRequest.entity = $scope.title;
                    $scope.labelRequest.ID = $scope.ID;
                    console.log("$scope.labelRequest",$scope.labelRequest);
                }
                else{
                    $scope.labelRequest.label = null;
                    $scope.labelRequest.entity = null;
                    $scope.labelRequest.ID = null;
                }
            };

            $scope.confirmLabel=function () {
                console.log("$scope.labelRequest",$scope.labelRequest);
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'recordlabel',
                    data : $scope.labelRequest
                }).then(function(resp, status) {
                    console.log(resp.data);
                    $scope.getItem();
                    $(label).attr("checked",false);
                    $(label1).attr("checked",false);
                    $(label2).attr("checked",false);
                    $(label3).attr("checked",false);
                    $(label4).attr("checked",false);
                    $scope.status = status;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }
        });