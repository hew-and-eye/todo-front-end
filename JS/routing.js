app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "../HTML/login.html"
    })
    .when("/manage", {
        templateUrl : "../HTML/manage.html"
    })
    .when("/view", {
        templateUrl : "../HTML/view.html"
    });
});


// /Users/m1038980/Documents/Todo Demo/HTML/login.html
// /Users/m1038980/Documents/Todo Demo/JS/routing.js