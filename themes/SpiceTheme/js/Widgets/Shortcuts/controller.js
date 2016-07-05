SpiceCRM.controller('shortcutsCtrl', ['$scope','shortcutsService','UserConfigService', function (_scope, _service, _userConfig) {
    angular.extend(_scope, {
        shortcutsWidget:{
            name:'Shortcuts',
            label:'Shortcuts',
            closed:false,
            class:function(){
                if(_userConfig.objects.Shortcuts_collapsed !== "true"){
                    return 'open';
                }else{
                    return 'close';
                }
            }
        },
        userConfigService: _userConfig,
        shortcutsService: _service
    });
}]);

SpiceCRM.directive('shortcutsWidget', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/Shortcuts/template.html',
            controller: 'shortcutsCtrl',
            replace: true
        };
    }
]);

SpiceCRM.directive('shortcutsItem', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/Shortcuts/entry.html',
            replace: true,
            scope:{
                itemData:'='
            }
        };
    }
]);