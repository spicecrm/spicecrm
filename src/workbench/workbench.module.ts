/**
 * @module WorkbenchModule
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule}   from "@angular/forms";

// MODULEs
import {SystemComponents} from "../systemcomponents/systemcomponents";
import {DirectivesModule} from "../directives/directives";
import {ObjectFields} from "../objectfields/objectfields";
import {ObjectComponents} from "../objectcomponents/objectcomponents";
import {GlobalComponents} from "../globalcomponents/globalcomponents";
import {DragDropModule} from '@angular/cdk/drag-drop';

// COMPONENTs
import {DictionaryManagerItemStatus} from "./components/dictionarymanageritemstatus";

import {DictionaryManager} from "./components/dictionarymanager";
import {DictionaryManagerDefinitions} from "./components/dictionarymanagerdefinitions";
import {DictionaryManagerDefinitionTabs} from "./components/dictionarymanagerdefinitiontabs";
import {DictionaryManagerItems} from "./components/dictionarymanageritems";
import {DictionaryManagerItemDetails} from "./components/dictionarymanageritemdetails";
import {DictionaryManagerAddDefinitionModal} from "./components/dictionarymanageradddefinitionmodal";
import {DictionaryManagerMigrateDefinitionModal} from "./components/dictionarymanagermigratedefinitionmodal";
import {DictionaryManagerAddItemModal} from "./components/dictionarymanageradditemmodal";
import {DictionaryManagerRelationships} from "./components/dictionarymanagerrelationships";
import {DictionaryManagerRelationshipsDetails} from "./components/dictionarymanagerrelationshipsdetails";
import {DictionaryManagerRelationshipAdd} from "./components/dictionarymanagerrelationshipadd";
import {DictionaryManagerRelationshipAddOneToMany} from "./components/dictionarymanagerrelationshipaddonetomany";
import {DictionaryManagerRelationshipContainerOneToMany} from "./components/dictionarymanagerrelationshipcontaineronetomany";
import {DictionaryManagerRelationshipAddManyToMany} from "./components/dictionarymanagerrelationshipaddmanytomany";
import {DictionaryManagerRelationshipAddOneToManyPolymorph} from "./components/dictionarymanagerrelationshipaddonetomanypolymorph";
import {DictionaryManagerRelationshipContainerOneToManyPolymorph} from "./components/dictionarymanagerrelationshipcontaineronetomanypolymorph";
import {DictionaryManagerRelationshipContainerOneToManyPolymorphAddRelated} from "./components/dictionarymanagerrelationshipcontaineronetomanypolymorphaddrelated";
import {DictionaryManagerRelationshipContainerManyToMany} from "./components/dictionarymanagerrelationshipcontainermanytomany";
import {DictionaryManagerRelationshipAddParent} from "./components/dictionarymanagerrelationshipaddparent";
import {DictionaryManagerRelationshipContainerParent} from "./components/dictionarymanagerrelationshipcontainerparent";
import {DictionaryManagerIndexes} from "./components/dictionarymanagerindexes";
import {DictionaryManagerIndexAdd} from "./components/dictionarymanagerindexadd";
import {DictionaryManagerIndexAddType} from "./components/dictionarymanagerindexaddtype";
import {DictionaryManagerIndexDetails} from "./components/dictionarymanagerindexdetails";
import {DictionaryManagerFields} from "./components/dictionarymanagerfields";
import {DictionaryManagerDeleteFieldsModal} from "./components/dictionarymanagerdeletefieldsmodal";
import {DictionaryManagerDeleteModal} from "./components/dictionarymanagerdeletemodal";

import {DomainManager} from "./components/domainmanager";
import {DomainManagerDefinitions} from "./components/domainmanagerdefinitions";
import {DomainManagerFields} from "./components/domainmanagerfields";
import {DomainManagerFieldTabs} from "./components/domainmanagerfieldtabs";
import {DomainManagerFieldDetails} from "./components/domainmanagerfielddetails";
import {DomainManagerFieldValidation} from "./components/domainmanagerfieldvalidation";
import {DomainManagerAddDefinitionModal} from "./components/domainmanageradddefinitionmodal";
import {DomainManagerAddFieldModal} from "./components/domainmanageraddfieldmodal";
import {DomainManagerSelectValidation} from "./components/domainmanagerselectvalidation";
import {DomainManagerAddValidation} from "./components/domainmanageraddvalidation";
import {DomainManagerAddValidationValueModal} from "./components/domainmanageraddvalidationvaluemodal";

import {FieldsetManager} from "./components/fieldsetmanager";
import {FieldsetManagerFieldsetDetails} from "./components/fieldsetmanagerfieldsetdetails";
import {FieldsetManagerFieldDetails} from "./components/fieldsetmanagerfielddetails";
import {FieldsetManagerAddDialog} from "./components/fieldsetmanageradddialog";
import {FieldsetManagerEditDialog} from "./components/fieldsetmanagereditdialog";

import {ActionsetManager} from "./components/actionsetmanager";
import {ActionsetManagerActionDetails} from "./components/actionsetmanageractiondetails";
import {ActionsetManagerAddDialog} from "./components/actionsetmanageradddialog";

import {CategoryTreeManager} from "./components/categorytreemanager";
import {CategoryTreeManagerNode} from "./components/categorytreemanagernode";
import {CategoryTreeAddModal} from "./components/categorytreeaddmodal";

import {ComponentsetManager} from "./components/componentsetmanager";
import {ComponentsetManagerComponentsetDetails} from "./components/componentsetmanagercomponentsetdetails";

import {ComponentsetManagerAddDialog} from "./components/componentsetmanageradddialog";
import {ComponentsetManagerEditDialog} from "./components/componentsetmanagereditdialog";
import {ValidationRulesManager, MaybeJsonPipe} from "./components/validationrulesmanager";
import {ValidationRulesConditions} from "./components/validationrulesconditions";
import {ValidationRulesActions} from "./components/validationrulesactions";
import {LanguageTranslationsManager} from "./components/languagetranslationsmanager";
import {LanguageLabelManagerComponent,SortPipe} from "./components/languagelabelmanager";
import {LanguageLabelModal} from "./components/languagelabelmodal";
import {MailboxesManager} from "./components/mailboxesmanager";
import {MailboxesManagerList} from "./components/mailboxesmanagerlist"
import {MailboxesTransportsEnum} from "./components/mailboxestransportsenum";
import {MailboxesmanagerTestModal} from "./components/mailboxesmanagertestmodal";
import {MailboxesmanagerTestIMAPModal} from "./components/mailboxesmanagertestimapmodal";
import {MailboxesGmailTrafficManager} from "./components/mailboxesgmailtrafficmanager";
import {MailboxesMailgunTrafficManager} from "./components/mailboxesmailguntrafficmanager";
import {MailboxesSendgridTrafficManager} from "./components/mailboxessendgridtrafficmanager";
import {MailboxesSendinblueTrafficManager} from "./components/mailboxessendinbluetrafficmanager";
import {MailboxesTwillioTrafficManager} from "./components/mailboxestwilliotrafficmanager";
import {MailboxesA1SmsTrafficManager} from "./components/mailboxesa1smstrafficmanager";
import {MailboxesA1TrafficManager} from "./components/mailboxesa1trafficmanager";
import {MailboxesEWSTrafficManager} from "./components/mailboxesewstrafficmanager";
import {MailboxesEWSSelectFoldersModal} from "./components/mailboxesewsselectfoldersmodal";
import {MailboxesImpersonatedEWSTrafficManager} from "./components/mailboxesimpersonatedewstrafficmanager";
import {MailboxManagerAddDialog} from "./components/mailboxmanageradddialog";
import {MailboxesIMAPSMTPSelectFoldersModal} from "./components/mailboxesimapsmtpselectfoldersmodal";
import {MailboxesImapSmtpTrafficManager} from "./components/mailboxesimapsmtptrafficmanager";
import {MailboxesTransportManager} from "./components/mailboxestransportmanager";
import {MailboxesProcessors} from "./components/mailboxesprocessors";
import {SelectTreeComponent} from "./components/selecttree";
import {SelectTreeAddDialog} from "./components/selecttreeadddialog";
import {ConfigCleaner} from "./components/configcleaner";
import {StyleCacheCleaner} from "./components/stylecachecleaner";
import {GoogleCalendarManager} from "./components/googlecalendarmanager";
import {ConfigTransfer} from './components/configtransfer';

import {ModuleConfigManager} from "./components/moduleconfigmanager";

import {WorkbenchHeader} from "./components/workbenchheader";
import {WorkbenchHeaderControls} from "./components/workbenchheadercontrols";
import {WorkbenchConfig} from "./components/workbenchconfig";
import {WorkbenchConfigLabel} from "./components/workbenchconfiglabel";
import {ModuleConfigAddDialog} from "./components/moduleconfigadddialog";
import {FieldsetManagerCopyDialog} from "./components/fieldsetmanagercopydialog";
import {WorkbenchConfigOptionFieldset} from "./components/workbenchconfigoptionfieldset";
import {WorkbenchConfigOptionModulefilter} from "./components/workbenchconfigoptionmodulefilter";
import {WorkbenchConfigOptionActionset} from "./components/workbenchconfigoptionactionset";
import {WorkbenchConfigOptionBoolean} from "./components/workbenchconfigoptionboolean";
import {WorkbenchConfigOptionComponentset} from "./components/workbenchconfigoptioncomponentset";
import {WorkbenchConfigOptionModule} from "./components/workbenchconfigoptionmodule";
import {WorkbenchConfigOptionDefault} from "./components/workbenchconfigoptiondefault";
import {WorkbenchConfigOptionLabel} from "./components/workbenchconfigoptionlabel";
import {WorkbenchConfigOptionMethod} from "./components/workbenchconfigoptionmethod";
import {ObjectRepositoryManager, ObjectRepositoryManagerFilter} from "./components/objectrepositorymanager";
import {ObjectRepositoryManagerAddRepo} from "./components/objectrepositorymanageraddrepo";
import {ObjectRepositoryManagerAddModule} from "./components/objectrepositorymanageraddmodule";
import {ObjectRepositoryExport} from "./components/objectrepositoryexport";

import {CRMLogViewer} from './components/crmlogviewer';
import {CRMLogViewerList} from './components/crmlogviewerlist';
import {CRMLogViewerModal} from './components/crmlogviewermodal';
import {CRMLogViewerListModal} from './components/crmlogviewerlistmodal';

import {APIlogViewer} from './components/apilogviewer';
import {APIlogViewerModal} from './components/apilogviewermodal';

import {ModuleFilterBuilder} from "./components/modulefilterbuilder";
import {ModuleFilterBuilderFilters} from "./components/modulefilterbuilderfilters";
import {ModuleFilterBuilderFilterDetails} from "./components/modulefilterbuilderfilterdetails";

import {DashletGenerator} from "./components/dashletgenerator";
import {DashletGeneratorDashlets} from "./components/dashletgeneratordashlets";
import {DashletGeneratorDashletDetails} from "./components/dashletgeneratordashletdetails";
import {APIlogConfig} from "./components/apilogconfig";
import {DictionaryManagerEditDefinitionModal} from "./components/dictionarymanagereditdefinitionmodal";
import {CategoryTreeManagerLinkModal} from "./components/categorytreemanagerlinkmodal";
import {RoleMenuManager} from "./components/rolemenumanager";
import {RoleMenuManagerEditRoleModal} from "./components/rolemenumanagereditrolemodal";
import {GitPullFromRepository} from "./components/gitpullfromrepository";
import {GitStatusOfRepository} from "./components/gitstatusofrepository";
import {DictionaryManagerRepairAll} from "./components/dictionarymanagerrepairall";
import {DictionaryManagerRelationshipAddEmailAddress} from "./components/dictionarymanagerrelationshipaddemailaddress";
import {DictionaryManagerRelationshipContainerEmailAddress} from "./components/dictionarymanagerrelationshipcontaineremailaddress";
import {DictionaryManagerCloneDefinitionModal} from "./components/dictionarymanagerclonedefinitionmodal";
import {HooksManager} from "./components/hooksmanager";
import {HooksManagerHooks} from "./components/hooksmanagerhooks";
import {HooksManagerHooksEditModal} from "./components/hooksmanagerhookseditmodal";
import {WebHooksManager} from "./components/webhooksmanager";
import {WebHooksManagerEditModal} from "./components/webhooksmanagereditmodal";
import {DictionaryFilterRelationshipPipe} from "./pipes/dictionarymanagerfilterrelationship.pipe";
import {
    DictionaryFilterRelationshipTemplatePipe
} from "./pipes/dictionarymanagerfilterrelationshiptemplate.pipe";
import {DictionaryManagerRelationshipAddUser} from "./components/dictionarymanagerrelationshipadduser";
import {DictionaryManagerRelationshipContainerUser} from "./components/dictionarymanagerrelationshipcontaineruser";
import {DictionaryManagerFixDBFieldsMismatchModal} from "./components/dictionarymanagerfixdbfieldsmismatchmodal";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        ObjectFields,
        ObjectComponents,
        GlobalComponents,
        DragDropModule
    ],
    declarations: [
        CategoryTreeManager,
        CategoryTreeManagerNode,
        CategoryTreeManagerLinkModal,
        CategoryTreeAddModal,
        DomainManager,
        DomainManagerDefinitions,
        DomainManagerFields,
        DomainManagerFieldTabs,
        DomainManagerFieldDetails,
        DomainManagerFieldValidation,
        DomainManagerAddDefinitionModal,
        DomainManagerAddFieldModal,
        DomainManagerSelectValidation,
        DomainManagerAddValidation,
        DomainManagerAddValidationValueModal,
        DictionaryManager,
        DictionaryManagerDefinitions,
        DictionaryManagerDefinitionTabs,
        DictionaryManagerItems,
        DictionaryManagerItemDetails,
        DictionaryManagerItemStatus,
        DictionaryManagerAddDefinitionModal,
        DictionaryManagerCloneDefinitionModal,
        DictionaryManagerMigrateDefinitionModal,
        DictionaryManagerEditDefinitionModal,
        DictionaryManagerAddItemModal,
        DictionaryManagerRelationships,
        DictionaryManagerRelationshipsDetails,
        DictionaryManagerRelationshipAdd,
        DictionaryManagerRelationshipAddOneToMany,
        DictionaryManagerRelationshipAddOneToManyPolymorph,
        DictionaryManagerRelationshipContainerOneToManyPolymorph,
        DictionaryManagerRelationshipContainerOneToManyPolymorphAddRelated,
        DictionaryManagerRelationshipContainerOneToMany,
        DictionaryManagerRelationshipAddManyToMany,
        DictionaryManagerRelationshipAddEmailAddress,
        DictionaryManagerRelationshipContainerEmailAddress,
        DictionaryManagerRelationshipContainerManyToMany,
        DictionaryManagerRelationshipAddParent,
        DictionaryManagerRelationshipContainerParent,
        DictionaryManagerIndexes,
        DictionaryManagerIndexAdd,
        DictionaryManagerIndexAddType,
        DictionaryManagerIndexDetails,
        DictionaryManagerFields,
        DictionaryManagerDeleteFieldsModal,
        DictionaryManagerDeleteModal,
        DictionaryManagerRepairAll,
        FieldsetManager,
        FieldsetManagerFieldsetDetails,
        FieldsetManagerFieldDetails,
        FieldsetManagerAddDialog,
        FieldsetManagerEditDialog,
        FieldsetManagerCopyDialog,
        ActionsetManager,
        ActionsetManagerActionDetails,
        ActionsetManagerAddDialog,
        ComponentsetManager,
        ComponentsetManagerComponentsetDetails,
        WorkbenchHeader,
        WorkbenchHeaderControls,
        WorkbenchConfigLabel,
        WorkbenchConfigOptionDefault,
        WorkbenchConfigOptionFieldset,
        WorkbenchConfigOptionModulefilter,
        WorkbenchConfigOptionComponentset,
        WorkbenchConfigOptionModule,
        WorkbenchConfigOptionActionset,
        WorkbenchConfigOptionBoolean,
        WorkbenchConfigOptionLabel,
        WorkbenchConfigOptionMethod,
        ComponentsetManagerAddDialog,
        ComponentsetManagerEditDialog,
        ValidationRulesManager,
        ValidationRulesConditions,
        ValidationRulesActions,
        MaybeJsonPipe,
        LanguageTranslationsManager,
        LanguageLabelManagerComponent,
        LanguageLabelModal,
        MailboxesManager,
        MailboxesManagerList,
        MailboxesTransportsEnum,
        LanguageLabelModal,
        MailboxManagerAddDialog,
        MailboxesmanagerTestModal,
        MailboxesmanagerTestIMAPModal,
        MailboxesImapSmtpTrafficManager,
        MailboxesIMAPSMTPSelectFoldersModal,
        MailboxesGmailTrafficManager,
        MailboxesMailgunTrafficManager,
        MailboxesSendgridTrafficManager,
        MailboxesSendinblueTrafficManager,
        MailboxesTwillioTrafficManager,
        MailboxesA1SmsTrafficManager,
        MailboxesA1TrafficManager,
        MailboxesEWSTrafficManager,
        MailboxesImpersonatedEWSTrafficManager,
        MailboxesEWSSelectFoldersModal,
        MailboxesTransportManager,
        SortPipe,
        MailboxesProcessors,
        SelectTreeComponent,
        SelectTreeAddDialog,
        ModuleConfigManager,
        ModuleConfigAddDialog,
        WorkbenchConfig,
        ConfigCleaner,
        StyleCacheCleaner,
        GoogleCalendarManager,
        ObjectRepositoryManager,
        ObjectRepositoryManagerFilter,
        ObjectRepositoryManagerAddRepo,
        ObjectRepositoryExport,
        ObjectRepositoryManagerAddModule,
        CRMLogViewer,
        CRMLogViewerList,
        CRMLogViewerModal,
        CRMLogViewerListModal,
        APIlogConfig,
        APIlogViewer,
        APIlogViewerModal,
        APIlogConfig,
        ModuleFilterBuilder,
        ModuleFilterBuilderFilters,
        ModuleFilterBuilderFilterDetails,
        DashletGenerator,
        DashletGeneratorDashlets,
        DashletGeneratorDashletDetails,
        ConfigTransfer,
        RoleMenuManager,
        RoleMenuManagerEditRoleModal,
        GitPullFromRepository,
        GitStatusOfRepository,
        HooksManager,
        HooksManagerHooks,
        HooksManagerHooksEditModal,
        WebHooksManager,
        WebHooksManagerEditModal,
        DictionaryFilterRelationshipPipe,
        DictionaryFilterRelationshipTemplatePipe,
        DictionaryManagerRelationshipAddUser,
        DictionaryManagerRelationshipContainerUser,
        DictionaryManagerFixDBFieldsMismatchModal
    ],
    exports: [
        SortPipe,
        WorkbenchConfigLabel,
        DictionaryManager,
    ]
})
export class WorkbenchModule {}
