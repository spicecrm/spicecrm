angular.module('SpiceCRM').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('themes/SpiceTheme/js/Widgets/Favorites/entry.html',
    "<li title=\"{{itemData.module_name}}: {{itemData.item_summary}}\"><a href=\"index.php?module={{itemData.module_name}}&action=DetailView&record={{itemData.item_id}}\"><span>{{itemData.item_summary_short}}</span></a><div class=\"moduleIcon\"><img ng-src=\"themes/SpiceTheme/images/{{itemData.module_name}}.gif\" onerror=\"this.src='include/images/blank.gif'\"></div><div class=\"changeIcon\"><a title=\"{{itemData.module_name}}: {{itemData.item_summary}}\" href=\"index.php?module={{itemData.module_name}}&action=EditView&record={{itemData.item_id}}\"><img src=\"themes/SpiceTheme/images/edit_inline.gif\"></a></div></li>"
  );


  $templateCache.put('themes/SpiceTheme/js/Widgets/Favorites/template.html',
    "<div id=\"{{favoritesWidget.name}}\" class=\"shortcuts\"><span class=\"shortcutstitle\">{{favoritesWidget.label}}</span><div id=\"expand_{{favoritesWidget.name}}\" class=\"expander\" ng-click=\"userConfigService.toggle(favoritesWidget.name,true)\"><span ng-show=\"userConfigService.objects.Favorites_collapsed == 'true'\" class=\"arrow_down\"></span> <span ng-show=\"userConfigService.objects.Favorites_collapsed == 'false'\" class=\"arrow_up\"></span></div><div ng-if=\"favoritesService.loading\">loading...</div><div id=\"widget_cotent_{{favoritesWidget.name}}\" ng-class=\"'widget_content '+favoritesWidget.class()\" ng-if=\"!favoritesService.loading\"><ul ng-show=\"userConfigService.objects.Favorites_collapsed == 'false'\"><favorites-item ng-repeat=\"object in favoritesService.objects\" item-data=\"object\"></favorites-item></ul></div></div>"
  );


  $templateCache.put('themes/SpiceTheme/js/Widgets/LastViewed/entry.html',
    "<li title=\"{{itemData.module_name}}: {{itemData.item_summary}}\"><a href=\"index.php?module={{itemData.module_name}}&action=DetailView&record={{itemData.item_id}}\"><span>{{itemData.item_summary_short}}</span></a><div class=\"moduleIcon\"><img ng-src=\"themes/SpiceTheme/images/{{itemData.module_name}}.gif\" onerror=\"this.src='include/images/blank.gif'\"></div><div class=\"changeIcon\"><a title=\"{{itemData.module_name}}: {{itemData.item_summary}}\" href=\"index.php?module={{itemData.module_name}}&action=EditView&record={{itemData.item_id}}\"><img src=\"themes/SpiceTheme/images/edit_inline.gif\"></a></div></li>"
  );


  $templateCache.put('themes/SpiceTheme/js/Widgets/LastViewed/template.html',
    "<div id=\"{{lastViewedWidget.name}}\" class=\"shortcuts\"><span class=\"shortcutstitle\">{{lastViewedWidget.label}}</span><div id=\"expand_{{lastViewedWidget.name}}\" class=\"expander\" ng-click=\"userConfigService.toggle(lastViewedWidget.name,true)\"><span ng-show=\"userConfigService.objects.LastViewed_collapsed == 'true'\" class=\"arrow_down\"></span> <span ng-show=\"userConfigService.objects.LastViewed_collapsed == 'false'\" class=\"arrow_up\"></span></div><div ng-if=\"lastViewedService.loading\">loading...</div><div id=\"widget_cotent_{{lastViewedWidget.name}}\" ng-class=\"'widget_content '+lastViewedWidget.class()\" ng-if=\"!lastViewedService.loading\"><ul ng-show=\"userConfigService.objects.LastViewed_collapsed == 'false'\"><last-viewed-item ng-repeat=\"object in lastViewedService.objects\" item-data=\"object\"></last-viewed-item></ul></div></div>"
  );


  $templateCache.put('themes/SpiceTheme/js/Widgets/Shortcuts/entry.html',
    "<li style=\"white-space:nowrap\"><span ng-if=\"itemData.URL == ''\">{{itemData.LABEL}}</span> <a ng-if=\"itemData.URL !== ''\" href=\"{{itemData.URL}}\"><span>{{itemData.LABEL}}</span></a></li>"
  );


  $templateCache.put('themes/SpiceTheme/js/Widgets/Shortcuts/template.html',
    "<div id=\"{{shortcutsWidget.name}}\" class=\"shortcuts\"><span class=\"shortcutstitle\">{{shortcutsWidget.label}}</span><div id=\"expand_{{shortcutsWidget.name}}\" class=\"expander\" ng-click=\"userConfigService.toggle(shortcutsWidget.name,true)\"><span ng-show=\"userConfigService.objects.Shortcuts_collapsed == 'true'\" class=\"arrow_down\"></span> <span ng-show=\"userConfigService.objects.Shortcuts_collapsed == 'false'\" class=\"arrow_up\"></span></div><div ng-if=\"shortcutsService.loading\">loading...</div><div id=\"widget_cotent_{{shortcutsWidget.name}}\" ng-class=\"'widget_content '+shortcutsWidget.class()\" ng-if=\"!shortcutsService.loading\"><ul ng-show=\"userConfigService.objects.Shortcuts_collapsed == 'false'\"><shortcuts-item ng-repeat=\"object in shortcutsService.objects\" item-data=\"object\"></shortcuts-item></ul></div></div>"
  );

}]);
