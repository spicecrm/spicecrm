SpiceCRM.controller('LastViewedCtrl', ['$scope','LastViewedService','UserConfigService', function (_scope, _service, _userConfig) {
    angular.extend(_scope, {
        lastViewedWidget:{
            name:'LastViewed',
            label:'Last Viewed',
            closed:false,
            class:function(){
                if(_userConfig.objects.LastViewed_collapsed !== "true"){
                    return 'open';
                }else{
                    return 'close';
                }
            }
        },
        userConfigService: _userConfig,
        lastViewedService: _service
    });
}]);

SpiceCRM.directive('lastViewedWidget', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/LastViewed/template.html',
            controller: 'LastViewedCtrl',
            replace: true
        };
    }
]);

SpiceCRM.directive('lastViewedItem', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/LastViewed/entry.html',
            replace: true,
            scope:{
                itemData:'='
            }
        };
    }
]);