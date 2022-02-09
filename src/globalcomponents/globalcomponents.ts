/**
 * @module GlobalComponents
 */
import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {DirectivesModule} from "../directives/directives";
import {NgModule} from "@angular/core";

import {ObjectFields}      from "../objectfields/objectfields";
import {ObjectComponents}      from "../objectcomponents/objectcomponents";
import {SystemComponents}      from "../systemcomponents/systemcomponents";

/**
 * @ignore
 */
declare var _: any;

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
import {GlobalCountdown} from "./components/globalcountdown";
import {GlobalHeaderReminders} from "./components/globalheaderreminders";
import {GlobalSubscriptionsManager} from "./components/globalsubscriptionsmanager";
import {GlobalLoginOAuth2} from "./components/globalloginoauth2";
import {GlobalLoginOAuth2Button} from "./components/globalloginoauth2button";

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
        ObjectComponents,
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
        GlobalHeaderReminders,
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
        GlobalNotificationsListView,
        GlobalCountdown,
        GlobalSubscriptionsManager,
        GlobalLoginOAuth2,
        GlobalLoginOAuth2Button
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
        GlobalHeaderSearchResultsItem
    ]
})
export class GlobalComponents {

    constructor() {
    }
}
