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

import {GlobalCopyright} from "./components/globalcopyright";
import {GlobalHeader} from "./components/globalheader";
import {GlobalHeaderTrialBar} from "./components/globalheadertrialbar";
import {GlobalHeaderTop} from "./components/globalheadertop";
import {GlobalHeaderSearch} from "./components/globalheadersearch";
import {GlobalHeaderSearchResultsItems} from "./components/globalheadersearchresultsitems";
import {GlobalHeaderSearchResultsItem} from "./components/globalheadersearchresultsitem";
import {GlobalHeaderSearchRecentItems} from "./components/globalheadersearchrecentitems";
import {GlobalHeaderSearchRecentItem} from "./components/globalheadersearchrecentitem";
import {GlobalHeaderTools} from "./components/globalheadertools";
import {GlobalHeaderActions} from "./components/globalheaderactions";
import {GlobalHeaderActionItem} from "./components/globalheaderactionitem";
import {GlobalHeaderFavorite} from "./components/globalheaderfavorite";
import {GlobalHeaderLabelInlineEdit} from "./components/globalheaderlabelinlineedit";
import {GlobalHeaderWorkbench} from "./components/globalheaderworkbench";
import {GlobalHeaderReload} from "./components/globalheaderreload";
import {GlobalFooter} from "./components/globalfooter";

import {GlobalSetup} from "./components/globalsetup";
import {GlobalLogin} from "./components/globallogin";
import {GlobalLoginLoading} from "./components/globalloginloading";
import {GlobalLoginChangePassword} from "./components/globalloginchangepassword";
import {GlobalLoginForgotPassword} from "./components/globalloginforgotpassword";
import {GlobalLoginResetPassword} from "./components/globalloginresetpassword";
import {GlobalLoginGoogle} from "./components/globallogingoogle";
import {GlobalLoginImage} from './components/globalloginimage';
import {GlobalReLogin} from './components/globalrelogin';
import {GlobalReConnect} from './components/globalreconnect';

import {GlobalNavigation} from "./components/globalnavigation";
import {GlobalNavigationMenu} from "./components/globalnavigationmenu";
import {GlobalNavigationMenuItemActionContainer} from "./components/globalnavigationmenuitemactioncontainer";
import {GlobalNavigationMenuItem} from "./components/globalnavigationmenuitem";
import {GlobalNavigationMenuItemNew} from "./components/globalnavigationmenuitemnew";
import {GlobalNavigationMenuItemActionNew} from "./components/globalnavigationmenuitemactionnew";
import {GlobalNavigationMenuItemRoute} from "./components/globalnavigationmenuitemroute";
import {GlobalNavigationMenuItemActionRoute} from "./components/globalnavigationmenuitemactionroute";
import {GlobalNavigationMenuItemIcon} from "./components/globalnavigationmenuitemicon";
import {GlobalNavigationMenuMore} from "./components/globalnavigationmenumore";
import {GlobalNavigationCompact} from "./components/globalnavigationcompact";
import {GlobalDockedComposerContainer} from "./components/globaldockedcomposercontainer";
import {GlobalDockedComposer} from "./components/globaldockedcomposer";
import {GlobalDockedComposerCall} from "./components/globaldockedcomposercall";
import {GlobalDockedComposerModal} from "./components/globaldockedcomposermodal";
import {GlobalDockedComposerOverflow} from "./components/globaldockedcomposeroverflow";
import {GlobalDockedComposerMessagesBadge} from "./components/globaldockedcomposermessagesbadge";
import {GlobalComposeButton} from "./components/globalcomposebutton";
import {GlobalAppLauncher} from "./components/globalapplauncher";
import {GlobalAppLauncherDialog} from "./components/globalapplauncherdialog";
import {GlobalAppLauncherDialogRoleTile} from "./components/globalapplauncherdialogroletile";

import {GlobalNavigationTabbed} from "./components/globalnavigationtabbed";
import {GlobalNavigationTabbedBrowser} from "./components/globalnavigationtabbedbrowser";
import {GlobalNavigationTabbedBrowserModal} from "./components/globalnavigationtabbedbrowsermodal";
import {GlobalNavigationTabbedBrowserModalTab} from "./components/globalnavigationtabbedbrowsermodaltab";
import {GlobalNavigationTabbedBrowserModalTabActions} from "./components/globalnavigationtabbedbrowsermodaltabactions";
import {GlobalNavigationTabbedMenuModules} from "./components/globalnavigationtabbedmenumodules";
import {GlobalNavigationTabbedMenuModuleMenu} from "./components/globalnavigationtabbedmenumodulemenu";
import {GlobalNavigationTabbedMenuTab} from "./components/globalnavigationtabbedmenutab";
import {GlobalNavigationTabbedMoreTab} from "./components/globalnavigationtabbedmoretab";
import {GlobalNavigationTabbedMenu} from "./components/globalnavigationtabbedmenu";
import {GlobalNavigationTabbedSubtabItem} from "./components/globalnavigationtabbedsubtabitem";
import {GlobalNavigationTabbedSubTabMoreTab} from "./components/globalnavigationtabbedsubtabmoretab";
import {GlobalNavigationTabbedSubtabs} from "./components/globalnavigationtabbedsubtabs";

import {GlobalUser} from "./components/globaluser";
import {GlobaUserPanel} from "./components/globaluserpanel";
import {GlobaUserPanelIcon} from "./components/globauserpanelicon";

import {GlobalRecentItems} from "./components/globalrecentitems";
import {GlobalSearch} from "./components/globalsearch";
import {GlobalSearchModule} from "./components/globalsearchmodule";
import {GlobalSearchModuleOnly} from "./components/globalsearchmoduleonly";
import {GlobalSearchModuleItem} from "./components/globalsearchmoduleitem";

import {GlobalNewsFeed} from "./components/globalnewsfeed";
import {GlobalNewsFeedItem} from "./components/globalnewsfeeditem";

import {GlobalObtainImportantPreferences} from './components/globalobtainimportantpreferences';
import {GlobalObtainGDPRConsent} from './components/globalobtaingdprconsent';
import {GlobalObtainGDPRConsentContainer} from './components/globalobtaingdprconsentcontainer';
import {GlobalHeaderImage} from './components/globalheaderimage';
import {GlobalHeaderNotificationsItemGeneric} from './components/globalheadernotificationsitemgeneric';
import {GlobalHeaderNotificationsItemChange} from './components/globalheadernotificationsitemchange';
import {GlobalHeaderNotificationsItemAssign} from './components/globalheadernotificationsitemassign';
import {GlobalHeaderNotificationsItemDelete} from './components/globalheadernotificationsitemdelete';
import {GlobalHeaderNotificationsItemReminder} from './components/globalheadernotificationsitemreminder';
import {GlobalHeaderNotifications} from './components/globalheadernotifications';
import {GlobalNotificationsListView} from './components/globalnotificationslistview';
import {GlobalCountdown} from "./components/globalcountdown";
import {GlobalHeaderReminders} from "./components/globalheaderreminders";
import {GlobalSubscriptionsManager} from "./components/globalsubscriptionsmanager";
import {GlobalLoginOAuth2} from "./components/globalloginoauth2";
import {GlobalLoginOAuth2Button} from "./components/globalloginoauth2button";
import {GlobalHeaderReloadModal} from "./components/globalheaderreloadmodal";

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
        GlobalHeaderReloadModal,
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
}
