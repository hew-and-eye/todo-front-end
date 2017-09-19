app.controller('todoController', function($scope, $location) {
    // code for authentication //
    console.log("in controller");
    $scope.username;
    $scope.password;
    $scope.loggedIn;
    $scope.confirmPassword = "";
    $scope.newUser = false;
    $location.path("/");
    // to submit, check that fields are filled, and submit to server if they are
    $scope.login = function() {
        console.log("blorp");
        if($scope.username != "" && $scope.password != "" && (!$scope.newUser || $scope.password == $scope.confirmPassword))
        {
            console.log("changing path");
            $location.path("/manage")
        }
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
            "users":["pleb", "clorb", "glox", "ranzamatab"]}]; // array of JSONs with task data
    //////////////////////////////////////

    // stuff for making/editing a task //
    $scope.taskName;
    $scope.taskDesc;
    $scope.taskDone;
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
        let height = "8vh";
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
});