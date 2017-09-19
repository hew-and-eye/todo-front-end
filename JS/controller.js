app.controller('todoController', function($scope, $location, $http) {
    // code for authentication //
    $scope.username;
    $scope.password;
    $scope.loggedIn = true;
    $scope.confirmPassword = "";
    $scope.newUser = false;
    $scope.currentTask = 0;
    $scope.assignUsers = false;
    $location.path("/");
    // to submit, check that fields are filled, and submit to server if they are
    $scope.login = function () {
        $scope.username = document.getElementById("username").value;
        $scope.password = document.getElementById("password").value;
        console.log($scope.username);
        if ($scope.username != "" && $scope.password != "" && (!$scope.newUser || $scope.password == $scope.confirmPassword)) {
            $http({
                method: 'POST',
                dataType: "application/json",
                url: 'http://localhost:8080/TodoWebApp/TodoServlet',
                headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded'
                    'Content-Type': 'application/json'
                },
                contentType: 'application/json',
                mimeType: 'application/json',
                params: {
                    "optype": "login",
                    "username": $scope.username,
                    "password": $scope.password
                }
            }).then(function successCallback(response) {
                if (response.data.error == "false") {
                    $scope.tasks = [{"name":"", "description": "", "users":[]}].concat(response.data.data);
                    $location.path("/manage");
                }
                else alert(response.data.data);
                console.log(response);
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                console.log(response);
                alert("couldn't reach the server for verification :(");
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
        else alert("missing input fields");
    }
    // on server callback, route to view page
    /////////////////////////////

    // code for viewing/searching tasks //
    $scope.tasks = [
        {"name":"Buy groceries", "description":"let's be honest, I just want more snacks", "complete":"false",
            "users":["pleb", "clorb", "glox", "ranzamatab"]},
        {"name":"Eat groceries", "description":"And by groceries, I mean instant ramen, usually", "complete":"false",
            "users":["pleb", "clorb", "glox", "ranzamatab"]},
        {"name":"Buy groceries", "description":"let's be honest, I just want more snacks", "complete":"false",
            "users": ["pleb", "clorb", "glox", "ranzamatab"]
        }]; // array of JSONs with task data

    $scope.users = ["pleb", "clorb", "glox", "ranzamatab", "gromcrob", "chilbus", "gezgoz", "dormulan", "tramford", "riggis", "nalbuton"];
    $scope.userSearchText = "";
    //////////////////////////////////////

    // stuff for making/editing a task //
    $scope.newTaskName;
    $scope.newTaskDesc;
    $scope.taskId;
    $scope.assignedUsers;
    $scope.delete = function() {
        // submit delete request with task ID
        // splice from local task list
    }

    $scope.submitEdit = function() {
        // validate and submit all task fields
        // change in local task list
    }
    /////////////////////////////////////
    $scope.prevTask = -1;
    // task animation stuff /////////////
    $scope.expand = function(index) {
        if($scope.tasks[index].expanded == undefined) {
            $scope.tasks[index].expanded = false;
            console.log("added expanded variable to task");
        }
        $scope.tasks[index].expanded = !$scope.tasks[index].expanded;
        let height = "10vh";
        if($scope.tasks[index].expanded) height = "100vh";
        document.getElementById("tc-"+index).style.maxHeight=height;
        // $scope.collapse($scope.prevTask);
        // $scope.prevTask = index;
    }

    $scope.collapse = function(index) {
        if(index != -1)
            document.getElementById("tc-"+index).style.height="8vh";
        if(index == $scope.prevTask)
            $scope.prevTask = -1;
    }

    /////////////////////////////////////
    $scope.editUsers = function (index) {
        let oldUsers = $scope.tasks[index].users;
        $scope.oldUsers = oldUsers;
        $scope.assignUsers = true;
        $scope.currentTask = index;
    }
    $scope.closeAssign = function (keepChanges) {
        if (!keepChanges)
            $scope.tasks[$scope.currentTask].users = $scope.oldUsers;
        $scope.assignUsers = false;
    }
});