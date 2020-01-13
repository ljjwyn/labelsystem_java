/**
 * itemInfo的控制器
 *
 * @author lijiajie
 */
indexApp
    .controller(
        'profileCtrl',
        function($scope, $http, $timeout,$interval) {
            $scope.url="http://127.0.0.1:3001/";
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
            $scope.userEmail='';
            $scope.password='';
            $scope.userName = getCookie("userName");
            $scope.userId=getCookie("userId");
            $scope.getUserInfo=function () {
                $http({
                    url : 'getuserinfo',
                    method : 'POST',
                    data : {
                        "userId": $scope.userId
                    }
                }).then(function(resp, status) {
                    $scope.status = status;
                    console.log(resp.data);
                    $scope.userEmail=resp.data['userEamil'];
                    $scope.password=resp.data['password'];
                    $scope.phoneNum=resp.data['phoneNum'];
                    $scope.userDes=resp.data['userDes'];
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.getUserInfo();
            $scope.logout=function () {
                $http({
                    url : 'datasetuser/logoutinit',
                    method : 'POST',
                    data : {
                        "userId": $scope.userId
                    }
                }).then(function(resp, status) {
                    $scope.status = status;
                    console.log(resp.data);
                    window.location.href = 'logout';
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
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
            $scope.getTotelNum=function () {
                $http({
                    url : 'datasetuser/getlabelednum',
                    method : 'POST',
                    data : {
                        "userId": $scope.userId
                    }
                }).then(function(resp, status) {
                    $scope.status = status;
                    console.log(resp.data);
                    $scope.labeledNum=resp.data;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
                $http({
                    url : 'datasetuser/getsumlabelednum',
                    method : 'POST',
                    data : {
                        "userId": $scope.userId
                    }
                }).then(function(resp, status) {
                    $scope.status = status;
                    console.log(resp.data);
                    $scope.labeledSumNum=resp.data;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            };
            $scope.getTotelNum();
            $scope.phoneNum = '';
            $scope.userDes='';
            $scope.updateInfo=function () {
                $http({
                    url : 'updateinfo',
                    method : 'POST',
                    data : {
                        "phoneNum": $scope.phoneNum,
                        "userDes": $scope.userDes,
                        "userId": $scope.userId
                    }
                }).then(function(resp, status) {
                    swal.fire({
                        title:"用户信息更新完成！",
                        timer:2000
                    });
                    $scope.status = status;
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }
        });