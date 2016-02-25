angular.module('project', ['ngRoute', 'firebase'])
    .value('fbURL', 'https://sample-project-list.firebaseio.com/')

    .service('fbRef', function(fbURL) {
        return new Firebase(fbURL)
    })
    .service('projects', function(fbRef, $firebaseArray) {
        return $firebaseArray(fbRef);
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'ProjectListController as projectList',
                templateUrl:'list.html'
            })
            .when('/new', {
                controller:'NewProjectController as editProject',
                templateUrl:'detail.html'
            })
            .when('/edit/:projectId', {
                controller:'EditProjectController as editProject',
                templateUrl:'detail.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    })
    .controller('ProjectListController', function(projects) {
        var projectList = this;

        projectList.projects = projects;

    })
    .controller('NewProjectController', function($location, projects) {
        var editProject = this;

        editProject.save = function() {
            projects.$add(editProject.project).then(function() {
                $location.path('/')
            })
        }

    })
    .controller('EditProjectController', function($location, $routeParams, projects) {
        var editProject = this;
        var projectId = $routeParams.projectId,
            projectIndex;

        editProject.projects = projects;
        editProject.project = editProject.projects.$getRecord(projectId);

        editProject.save = function() {
            editProject.projects.$add(editProject.project).then(function() {
                $location.path('/')
            })
        }

        editProject.destroy = function() {
            editProject.projects.$remove(editProject.project).then(function() {
                $location.path('/')
            })
        }

    });

