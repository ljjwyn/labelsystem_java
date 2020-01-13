indexApp
    .controller(
        'registerCtrl',
        function($scope, $http, $timeout,$interval) {
            $scope.userName='';
            $scope.password='';
            $scope.userEmail='';
            $scope.registerUser=function () {
                console.log("$scope.userName",$scope.userName);
                console.log("$scope.password",$scope.password);
                console.log("$scope.userEmail",$scope.userEmail);
                $http({
                    url : 'register',
                    method : 'POST',
                    data : {
                        "userName": $scope.userName,
                        "userEmail": $scope.userEmail,
                        "password": $scope.password
                    }
                }).then(function(resp, status) {
                    swal.fire({
                        title: "注册成功！",
                        timer:2000
                    });
                    window.location.href = 'login.html';
                    $scope.status = status;
                    console.log(resp.data);
                }, function(resp, status) {
                    $scope.resp = resp;
                    $scope.status = status;
                });
            }
        });