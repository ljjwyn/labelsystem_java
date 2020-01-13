/**
 * itemInfo的控制器
 *
 * @author lijiajie
 */
indexApp
    .controller(
        'itemInfo',
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
            $scope.searchRequest={
                'ID':getCookie("ID")
            };
            $scope.getItem=function () {
                $http({
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    url : $scope.url+'getItem',
                    data : $scope.searchRequest
                }).then(function(resp, status) {
                    $scope.itemInfo = resp.data;
                    $scope.contentList=$scope.itemInfo.content;
                    $scope.catalogList=$scope.itemInfo.catalog;
                    $scope.summarys=$scope.itemInfo.summary;
                    $scope.title=$scope.itemInfo.title;
                    $scope.imgUrl=$scope.itemInfo.imgUrl;
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
            }
            $scope.getItem();
            /**
             * labelItem的相关函数
             * @param flage
             */

            $scope.chooseLabel=function (flage) {
                console.log("flage",flage);

            }
        });