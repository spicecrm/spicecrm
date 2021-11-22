/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module GlobalComponents
 */
import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {DirectivesModule} from "../directives/directives";
import {NgModule} from "@angular/core";
import {RouterModule,} from "@angular/router";

import {ObjectFields}      from "../objectfields/objectfields";
import {ObjectComponents}      from "../objectcomponents/objectcomponents";
import {SystemComponents}      from "../systemcomponents/systemcomponents";

/**
 * @ignore
 */
declare var _: any;
/**
 * @ignore
 */
declare var gapi: any;

import {loginService, loginCheck} from "../services/login.service";
import {metadata} from "../services/metadata.service";

import /*embed*/ {GlobalCopyright} from "./components/globalcopyright";
import /*embed*/ {GlobalHeader} from "./components/globalheader";
import /*embed*/ {GlobalHeaderTrialBar} from "./components/globalheadertrialbar";
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
import /*embed*/ {GlobalHeaderLabelInlineEdit} from "./components/globalheaderlabelinlineedit";
import /*embed*/ {GlobalHeaderWorkbench} from "./components/globalheaderworkbench";
import /*embed*/ {GlobalHeaderReload} from "./components/globalheaderreload";
import /*embed*/ {GlobalFooter} from "./components/globalfooter";

import /*embed*/ {GlobalSetup} from "./components/globalsetup";
import /*embed*/ {GlobalLogin} from "./components/globallogin";
import /*embed*/ {GlobalLoginLoading} from "./components/globalloginloading";
import /*embed*/ {GlobalLoginChangePassword} from "./components/globalloginchangepassword";
import /*embed*/ {GlobalLoginForgotPassword} from "./components/globalloginforgotpassword";
import /*embed*/ {GlobalLoginResetPassword} from "./components/globalloginresetpassword";
import /*embed*/ {GlobalLoginGoogle} from "./components/globallogingoogle";
import /*embed*/ {GlobalLoginImage} from './components/globalloginimage';
import /*embed*/ {GlobalReLogin} from './components/globalrelogin';
import /*embed*/ {GlobalReConnect} from './components/globalreconnect';

import /*embed*/ {GlobalNavigation} from "./components/globalnavigation";
import /*embed*/ {GlobalNavigationMenu} from "./components/globalnavigationmenu";
import /*embed*/ {GlobalNavigationMenuItemActionContainer} from "./components/globalnavigationmenuitemactioncontainer";
import /*embed*/ {GlobalNavigationMenuItem} from "./components/globalnavigationmenuitem";
import /*embed*/ {GlobalNavigationMenuItemNew} from "./components/globalnavigationmenuitemnew";
import /*embed*/ {GlobalNavigationMenuItemActionNew} from "./components/globalnavigationmenuitemactionnew";
import /*embed*/ {GlobalNavigationMenuItemRoute} from "./components/globalnavigationmenuitemroute";
import /*embed*/ {GlobalNavigationMenuItemActionRoute} from "./components/globalnavigationmenuitemactionroute";
import /*embed*/ {GlobalNavigationMenuItemIcon} from "./components/globalnavigationmenuitemicon";
import /*embed*/ {GlobalNavigationMenuMore} from "./components/globalnavigationmenumore";
import /*embed*/ {GlobalNavigationCompact} from "./components/globalnavigationcompact";
import /*embed*/ {GlobalDockedComposerContainer} from "./components/globaldockedcomposercontainer";
import /*embed*/ {GlobalDockedComposer} from "./components/globaldockedcomposer";
import /*embed*/ {GlobalDockedComposerCall} from "./components/globaldockedcomposercall";
import /*embed*/ {GlobalDockedComposerModal} from "./components/globaldockedcomposermodal";
import /*embed*/ {GlobalDockedComposerOverflow} from "./components/globaldockedcomposeroverflow";
import /*embed*/ {GlobalDockedComposerMessagesBadge} from "./components/globaldockedcomposermessagesbadge";
import /*embed*/ {GlobalComposeButton} from "./components/globalcomposebutton";
import /*embed*/ {GlobalAppLauncher} from "./components/globalapplauncher";
import /*embed*/ {GlobalAppLauncherDialog} from "./components/globalapplauncherdialog";
import /*embed*/ {GlobalAppLauncherDialogRoleTile} from "./components/globalapplauncherdialogroletile";

import /*embed*/ {GlobalNavigationTabbed} from "./components/globalnavigationtabbed";
import /*embed*/ {GlobalNavigationTabbedBrowser} from "./components/globalnavigationtabbedbrowser";
import /*embed*/ {GlobalNavigationTabbedBrowserModal} from "./components/globalnavigationtabbedbrowsermodal";
import /*embed*/ {GlobalNavigationTabbedBrowserModalTab} from "./components/globalnavigationtabbedbrowsermodaltab";
import /*embed*/ {GlobalNavigationTabbedBrowserModalTabActions} from "./components/globalnavigationtabbedbrowsermodaltabactions";
import /*embed*/ {GlobalNavigationTabbedMenuModules} from "./components/globalnavigationtabbedmenumodules";
import /*embed*/ {GlobalNavigationTabbedMenuModuleMenu} from "./components/globalnavigationtabbedmenumodulemenu";
import /*embed*/ {GlobalNavigationTabbedMenuTab} from "./components/globalnavigationtabbedmenutab";
import /*embed*/ {GlobalNavigationTabbedMoreTab} from "./components/globalnavigationtabbedmoretab";
import /*embed*/ {GlobalNavigationTabbedMenu} from "./components/globalnavigationtabbedmenu";
import /*embed*/ {GlobalNavigationTabbedSubtabItem} from "./components/globalnavigationtabbedsubtabitem";
import /*embed*/ {GlobalNavigationTabbedSubTabMoreTab} from "./components/globalnavigationtabbedsubtabmoretab";
import /*embed*/ {GlobalNavigationTabbedSubtabs} from "./components/globalnavigationtabbedsubtabs";

import /*embed*/ {GlobalUser} from "./components/globaluser";
import /*embed*/ {GlobaUserPanel} from "./components/globaluserpanel";
import /*embed*/ {GlobaUserPanelIcon} from "./components/globauserpanelicon";

import /*embed*/ {GlobalRecentItems} from "./components/globalrecentitems";
import /*embed*/ {GlobalSearch} from "./components/globalsearch";
import /*embed*/ {GlobalSearchModule} from "./components/globalsearchmodule";
import /*embed*/ {GlobalSearchModuleOnly} from "./components/globalsearchmoduleonly";
import /*embed*/ {GlobalSearchModuleItem} from "./components/globalsearchmoduleitem";

import /*embed*/ {GlobalNewsFeed} from "./components/globalnewsfeed";
import /*embed*/ {GlobalNewsFeedItem} from "./components/globalnewsfeeditem";

import /*embed*/ {GlobalObtainImportantPreferences} from './components/globalobtainimportantpreferences';
import /*embed*/ {GlobalObtainGDPRConsent} from './components/globalobtaingdprconsent';
import /*embed*/ {GlobalObtainGDPRConsentContainer} from './components/globalobtaingdprconsentcontainer';
import /*embed*/ {GlobalHeaderImage} from './components/globalheaderimage';
import /*embed*/ {GlobalHeaderNotificationsItemGeneric} from './components/globalheadernotificationsitemgeneric';
import /*embed*/ {GlobalHeaderNotificationsItemChange} from './components/globalheadernotificationsitemchange';
import /*embed*/ {GlobalHeaderNotificationsItemAssign} from './components/globalheadernotificationsitemassign';
import /*embed*/ {GlobalHeaderNotificationsItemDelete} from './components/globalheadernotificationsitemdelete';
import /*embed*/ {GlobalHeaderNotificationsItemReminder} from './components/globalheadernotificationsitemreminder';
import /*embed*/ {GlobalHeaderNotifications} from './components/globalheadernotifications';
import /*embed*/ {GlobalNotificationsListView} from './components/globalnotificationslistview';

/**
 * GlobalComponents holds records that are rendered in the global header and footer parts of the application. This includes e.g. the header menu and other components
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        DirectivesModule,
        SystemComponents,
        ObjectComponents
    ],
    declarations: [
        GlobalCopyright,
        GlobalNewsFeed,
        GlobalNewsFeedItem,
        GlobalHeader,
        GlobalHeaderTrialBar,
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
        GlobalHeaderLabelInlineEdit,
        GlobalHeaderWorkbench,
        GlobalHeaderReload,
        GlobalFooter,
        GlobalNavigation,
        GlobalNavigationMenu,
        GlobalNavigationMenuItem,
        GlobalNavigationMenuItemActionContainer,
        GlobalNavigationMenuItemNew,
        GlobalNavigationMenuItemActionNew,
        GlobalNavigationMenuItemRoute,
        GlobalNavigationMenuItemActionRoute,
        GlobalNavigationMenuItemIcon,
        GlobalNavigationMenuMore,
        GlobalNavigationCompact,
        GlobalLogin,
        GlobalLoginLoading,
        GlobalLoginChangePassword,
        GlobalReLogin,
        GlobalReConnect,
        GlobalSetup,
        GlobalLoginForgotPassword,
        GlobalLoginResetPassword,
        GlobalUser,
        GlobaUserPanel,
        GlobaUserPanelIcon,
        GlobalAppLauncher,
        GlobalAppLauncherDialog,
        GlobalAppLauncherDialogRoleTile,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerCall,
        GlobalDockedComposerModal,
        GlobalDockedComposerOverflow,
        GlobalDockedComposerMessagesBadge,
        GlobalComposeButton,
        GlobalRecentItems,
        GlobalSearch,
        GlobalSearchModule,
        GlobalSearchModuleOnly,
        GlobalSearchModuleItem,
        GlobalLoginGoogle,
        GlobalObtainImportantPreferences,
        GlobalObtainGDPRConsent,
        GlobalObtainGDPRConsentContainer,
        GlobalNavigationTabbed,
        GlobalNavigationTabbedMenu,
        GlobalNavigationTabbedMenuModules,
        GlobalNavigationTabbedMenuModuleMenu,
        GlobalNavigationTabbedMenuTab,
        GlobalNavigationTabbedMoreTab,
        GlobalNavigationTabbedBrowser,
        GlobalNavigationTabbedBrowserModal,
        GlobalNavigationTabbedBrowserModalTab,
        GlobalNavigationTabbedBrowserModalTabActions,
        GlobalNavigationTabbedSubtabs,
        GlobalNavigationTabbedSubtabItem,
        GlobalNavigationTabbedSubTabMoreTab,
        GlobalHeaderImage,
        GlobalLoginImage,
        GlobalHeaderNotifications,
        GlobalHeaderNotificationsItemGeneric,
        GlobalHeaderNotificationsItemReminder,
        GlobalHeaderNotificationsItemChange,
        GlobalHeaderNotificationsItemAssign,
        GlobalHeaderNotificationsItemDelete,
        GlobalNotificationsListView
    ],
    entryComponents: [
        GlobalCopyright,
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
        GlobalCopyright,
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

    constructor() {
    }
}
