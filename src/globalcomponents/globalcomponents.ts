import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {DirectivesModule} from "../directives/directives";
import {AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef, Injectable, Renderer, Renderer2, Input, ElementRef, OnDestroy, OnInit, OnChanges, EventEmitter, Output, ChangeDetectorRef, DoCheck} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {RouterModule, Routes, Router, ActivationStart, NavigationStart, ActivatedRoute} from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {Subject, Observable, of, Subscription, pipe} from "rxjs";
import {take} from "rxjs/operators";

declare var _: any;
declare var gapi: any;

import {loginService, loginCheck} from "../services/login.service";
import {session} from "../services/session.service";
import {backend} from "../services/backend.service";
import {language} from "../services/language.service";
import {configurationService} from "../services/configuration.service";
import {popup} from "../services/popup.service";
import {broadcast} from "../services/broadcast.service";
import {fts} from "../services/fts.service";
import {model} from "../services/model.service";
import {modellist} from "../services/modellist.service";
import {recent} from "../services/recent.service";
import {favorite} from "../services/favorite.service";
import {metadata} from "../services/metadata.service";
import {navigation} from "../services/navigation.service";
import {dockedComposer} from "../services/dockedcomposer.service";
import {view} from "../services/view.service";
import {toast} from "../services/toast.service";
import {footer} from "../services/footer.service";
import {cookie} from "../services/cookie.service";
import { modal } from "../services/modal.service";
import { loader } from "../services/loader.service";
import { layout } from "../services/layout.service";

import {ObjectFields}      from "../objectfields/objectfields";
import {SystemComponents}      from "../systemcomponents/systemcomponents";

import /*embed*/ {MenuService} from "./services/menu.service";

import /*embed*/ {GlobalHeader} from "./components/globalheader";
import /*embed*/ {GlobalHeaderTop} from "./components/globalheadertop";
import /*embed*/ {GlobalHeaderSearch} from "./components/globalheadersearch";
import /*embed*/ {GlobalHeaderSearchResultsItems} from "./components/globalheadersearchresultsitems";
import /*embed*/ {GlobalHeaderSearchResultsItem} from "./components/globalheadersearchresultsitem";
import /*embed*/ {GlobalHeaderSearchRecentItems} from "./components/globalheadersearchrecentitems";
import /*embed*/ {GlobalHeaderSearchRecentItem} from "./components/globalheadersearchrecentitem";
import /*embed*/ {GlobalHeaderTools} from "./components/globalheadertools";
import /*embed*/ {GlobalHeaderActions} from "./components/globalheaderactions";
import /*embed*/ {GlobalHeaderActionItem} from "./components/globalheaderactionitem";
import /*embed*/ {GlobalHeaderFavorite} from "./components/globalheaderfavorite";
import /*embed*/ {GlobalHeaderWorkbench} from "./components/globalheaderworkbench";
import /*embed*/ {GlobalFooter} from "./components/globalfooter";
import /*embed*/ {GlobalLogin} from "./components/globallogin";
import /*embed*/ {GlobalSetup} from "./components/globalsetup";
import /*embed*/ {GlobalLoginForgotPassword} from "./components/globalloginforgotpassword";
import /*embed*/ {GlobalLoginResetPassword} from "./components/globalloginresetpassword";
import /*embed*/ {GlobalNavigation} from "./components/globalnavigation";
import /*embed*/ {GlobalNavigationMenu} from "./components/globalnavigationmenu";
import /*embed*/ {GlobalNavigationMenuItem} from "./components/globalnavigationmenuitem";
import /*embed*/ {GlobalNavigationMenuItemNew} from "./components/globalnavigationmenuitemnew";
import /*embed*/ {GlobalNavigationMenuItemRoute} from "./components/globalnavigationmenuitemroute";
import /*embed*/ {GlobalNavigationMenuItemIcon} from "./components/globalnavigationmenuitemicon";
import /*embed*/ {GlobalNavigationMenuMore} from "./components/globalnavigationmenumore";
import /*embed*/ {GlobalNavigationCompact} from "./components/globalnavigationcompact";
import /*embed*/ {GlobalDockedComposerContainer} from "./components/globaldockedcomposercontainer";
import /*embed*/ {GlobalDockedComposer} from "./components/globaldockedcomposer";
import /*embed*/ {GlobalDockedComposerCall} from "./components/globaldockedcomposercall";
import /*embed*/ {GlobalDockedComposerModal} from "./components/globaldockedcomposermodal";
import /*embed*/ {GlobalDockedComposerOverflow} from "./components/globaldockedcomposeroverflow";
import /*embed*/ {GlobalComposeButton} from "./components/globalcomposebutton";
import /*embed*/ {GlobalAppLauncher} from "./components/globalapplauncher";
import /*embed*/ {GlobalAppLauncherDialog} from "./components/globalapplauncherdialog";
import /*embed*/ {GlobalAppLauncherDialogRoleTile} from "./components/globalapplauncherdialogroletile";


import /*embed*/ {GlobalUser} from "./components/globaluser";
import /*embed*/ {GlobaUserPanel} from "./components/globaluserpanel";

import /*embed*/ {GlobalRecentItems} from "./components/globalrecentitems";
import /*embed*/ {GlobalSearch} from "./components/globalsearch";
import /*embed*/ {GlobalSearchModule} from "./components/globalsearchmodule";
import /*embed*/ {GlobalSearchModuleOnly} from "./components/globalsearchmoduleonly";
import /*embed*/ {GlobalSearchModuleItem} from "./components/globalsearchmoduleitem";

import /*embed*/ {GlobalNewsFeed} from "./components/globalnewsfeed";
import /*embed*/ {GlobalNewsFeedItem} from "./components/globalnewsfeeditem";
import {VersionManagerService} from "../services/versionmanager.service";

import /*embed*/ {GlobalLoginGoogle} from "./components/globallogingoogle";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        DirectivesModule,
        SystemComponents,
        RouterModule.forRoot([
            {path: "login", component: GlobalLogin},
            {path: "setup", component: GlobalSetup},
            {path: "recent", component: GlobalRecentItems, canActivate: [loginCheck]},
            {path: "search", component: GlobalSearch, canActivate: [loginCheck]},
            {path: "search/:searchterm", component: GlobalSearch, canActivate: [loginCheck]},
        ])
    ],
    declarations: [
        GlobalNewsFeed,
        GlobalNewsFeedItem,
        GlobalHeader,
        GlobalHeaderTop,
        GlobalHeaderSearch,
        GlobalHeaderSearchResultsItems,
        GlobalHeaderSearchResultsItem,
        GlobalHeaderSearchRecentItems,
        GlobalHeaderSearchRecentItem,
        GlobalHeaderTools,
        GlobalHeaderActions,
        GlobalHeaderActionItem,
        GlobalHeaderFavorite,
        GlobalHeaderWorkbench,
        GlobalFooter,
        GlobalNavigation,
        GlobalNavigationMenu,
        GlobalNavigationMenuItem,
        GlobalNavigationMenuItemNew,
        GlobalNavigationMenuItemRoute,
        GlobalNavigationMenuItemIcon,
        GlobalNavigationMenuMore,
        GlobalNavigationCompact,
        GlobalLogin,
        GlobalSetup,
        GlobalLoginForgotPassword,
        GlobalLoginResetPassword,
        GlobalUser,
        GlobaUserPanel,
        GlobalAppLauncher,
        GlobalAppLauncherDialog,
        GlobalAppLauncherDialogRoleTile,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerCall,
        GlobalDockedComposerModal,
        GlobalDockedComposerOverflow,
        GlobalComposeButton,
        GlobalRecentItems,
        GlobalSearch,
        GlobalSearchModule,
        GlobalSearchModuleOnly,
        GlobalSearchModuleItem,
        GlobalLoginGoogle
    ],
    entryComponents: [
        GlobalHeader,
        GlobalNavigationMenuItem,
        GlobalNavigationMenuItemNew,
        GlobalNavigationMenuMore,
        GlobalHeaderTop,
        GlobalHeaderSearch,
        GlobalHeaderSearchResultsItems,
        GlobalHeaderSearchResultsItem,
        GlobalHeaderSearchRecentItems,
        GlobalHeaderSearchRecentItem,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerContainer],
    exports: [
        GlobalNewsFeed,
        GlobalHeader,
        GlobalFooter,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerOverflow,
        GlobalComposeButton,
    ]
})
export class GlobalComponents {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
