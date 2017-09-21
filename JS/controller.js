app.controller('todoController', function ($scope, $location, $http) {
    $scope.username;
    $scope.password;
    $scope.loggedIn = true;
    $scope.confirmPassword;
    $scope.newUser = false;
    $scope.currentTask = 0;
    $scope.assignUsers = false;
    $scope.missingFields = false;
    $scope.userSearchText = "";
    $scope.syncing = false; // used to control the "syncing with server" popup
    $location.path("/"); // redirect to login on refresh
    // to submit, check that fields are filled, and submit to server if they are
    $scope.login = function (optype) {
        if ($scope.username == undefined || $scope.username == null || $scope.username == "")
            $scope.username = document.getElementById("username").value;
        if ($scope.password == undefined || $scope.password == null || $scope.password == "")
            $scope.password = document.getElementById("password").value;
        if (optype == "adduser")
            $scope.confirmPassword = document.getElementById("confirmPassword").value;

        if (!$scope.newUser && optype == "adduser") { // the first time NEW USER is pressed nothing should get submitted
            $scope.newUser = true;
            return;
        }
        console.log($scope.username);
        if ($scope.username != "" && $scope.password != "" && (optype == "login" || $scope.password == $scope.confirmPassword)) {
            $scope.syncing = true;
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
                    "optype": optype,
                    "username": $scope.username,
                    "password": $scope.password
                }
            }).then(function successCallback(response) {
                if (response.data.error == "false") {
                    $scope.tasks = [{ "id": "99999", "name": "", "description": "", "complete": "false", "users": [$scope.username] }].concat(response.data.data);
                    console.log(response.data.users);
                    $scope.users = response.data.users;
                    $location.path("/manage");
                }
                else alert(response.data.data);
                $scope.syncing = false;
                //console.log(response);
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                console.log(response);
                alert("couldn't reach the server for verification :(");
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.syncing = false;
                });
        }
        else $scope.missingFields = true;
    }
    //////////////////////////////////////

    // stuff for making/editing a task //
    $scope.newTaskName;
    $scope.newTaskDesc;
    $scope.taskId;
    $scope.assignedUsers;
    $scope.delete = function () {
        // submit delete request with task ID
        // splice from local task list
    }

    $scope.post = function (index, optype) {
        $scope.syncing = true;
        if ($scope.tasks[index].name == undefined || $scope.tasks[index].name == "") {
            alert("please add a task name");
            $scope.syncing = false;
            return;
        }
        if ($scope.tasks[index].users.length == 0) {
            alert("please assign users");
            $scope.syncing = false;
            return;
        }
        if (index == 0) // the first task in the list is always blank, and the only function available show be creation
            optype = "createtask";
        //console.log("id is " + $scope.tasks[index].id + ", optype is" + optype);
        if (optype != "createtask") {
            index = $scope.tasks.length - index;
        }

        if (optype == "completetask") {
            if ($scope.tasks[index].complete == "false")
                $scope.tasks[index].complete = "true";
            else $scope.tasks[index].complete = "false";
            console.log(index + " : " +$scope.tasks[index].name);
        }
        // handle local changes
        let data = { // store data for the $http call because the tasks array is about to change
            "optype": optype,
            "name": $scope.tasks[index].name,
            "description": $scope.tasks[index].description,
            "complete": $scope.tasks[index].complete,
            "users": $scope.tasks[index].users,
            "id": $scope.tasks[index].id
        }
        if (optype == "createtask") {
            // if a new task was added, put a blank one at the front of the list
            $scope.tasks = [{"id":"99999", "name": "", "description": "", "complete":"false", "users": [$scope.username] }].concat($scope.tasks);
        } else if (optype == "deletetask") {
            // splice that sucker outta there
            $scope.tasks.splice(index, 1);
        }
        // handle server changes
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
            params: data
        }).then(function successCallback(response) {
            if (response.data.error == "false" || response.data.error == undefined) {
                console.log("posted successfully");
                $scope.login("login");
            }
            //console.log(response);
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response);
            $scope.syncing = false;
            alert("couldn't reach the server for verification :(");

            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }
    /////////////////////////////////////
    $scope.prevTask = -1;
    // task animation stuff /////////////
    $scope.expand = function (index) {
        if ($scope.tasks[index].expanded == undefined) {
            $scope.tasks[index].expanded = false;
            console.log("added expanded variable to task");
        }
        $scope.tasks[index].expanded = !$scope.tasks[index].expanded;
        let height = "10vh";
        if ($scope.tasks[index].expanded) height = "100vh";
        document.getElementById("tc-" + index).style.maxHeight = height;
        // $scope.collapse($scope.prevTask);
        // $scope.prevTask = index;
    }

    $scope.collapse = function (index) {
        if (index != -1)
            document.getElementById("tc-" + index).style.height = "8vh";
        if (index == $scope.prevTask)
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

    $scope.completeButtonClass = function (complete) {
        if (complete == "false") {
            return "task-incomplete-button";
        } else return "task-complete-button";
    }
});