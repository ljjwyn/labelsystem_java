/**
 * itemInfo的控制器
 *
 * @author lijiajie
 */
indexApp
    .controller(
        'loginCtrl',
        function($scope, $http, $timeout,$interval) {
            $scope.userName='';
            $scope.password='';
            $scope.login=function () {
                console.log("$scope.userName",$scope.userName);
                console.log("$scope.password",$scope.password);
                $http({
                    url : 'loginPost',
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    },
                    data : 'account=' + $scope.userName + '&password='
                        + $scope.password
                }).then(function(resp, status) {
                    $scope.status = status;
                    console.log(resp.data);
                    swal.fire({
                        title:resp.data['message'],
                        timer:2000
                    });
                    document.cookie="userId="+resp.data['userId'];
                    document.cookie="userName="+resp.data['userName'];
                    console.log("document.cookie",document.cookie);
                    window.location.href = 'pages-profile.html';
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }
        });