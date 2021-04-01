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

// Interfaces
import /*embed*/ {DictionaryManagerMessage, DictionaryDefinition, DictionaryItem, Relationship, RelationshipRelateField, DictionaryIndex, DictionaryIndexItem} from "./interfaces/dictionarymanager.interfaces";
import /*embed*/ {DomainDefinition, DomainField} from "./interfaces/domainmanager.interfaces";

// Services
import /*embed*/ {domainmanager} from "./services/domainmanager.service";
import /*embed*/ {dictionarymanager} from "./services/dictionarymanager.service";

// COMPONENTs
import /*embed*/ {DictionaryManagerItemStatus} from "./components/dictionarymanageritemstatus";

import /*embed*/ {DictionaryManager} from "./components/dictionarymanager";
import /*embed*/ {DictionaryManagerDefinitions} from "./components/dictionarymanagerdefinitions";
import /*embed*/ {DictionaryManagerDefinitionTabs} from "./components/dictionarymanagerdefinitiontabs";
import /*embed*/ {DictionaryManagerItems} from "./components/dictionarymanageritems";
import /*embed*/ {DictionaryManagerItemDetails} from "./components/dictionarymanageritemdetails";
import /*embed*/ {DictionaryManagerAddDefinitionModal} from "./components/dictionarymanageradddefinitionmodal";
import /*embed*/ {DictionaryManagerAddItemModal} from "./components/dictionarymanageradditemmodal";
import /*embed*/ {DictionaryManagerRelationships} from "./components/dictionarymanagerrelationships";
import /*embed*/ {DictionaryManagerRelationshipsDetails} from "./components/dictionarymanagerrelationshipsdetails";
import /*embed*/ {DictionaryManagerRelationshipAdd} from "./components/dictionarymanagerrelationshipadd";
import /*embed*/ {DictionaryManagerRelationshipAddOneToMany} from "./components/dictionarymanagerrelationshipaddonetomany";
import /*embed*/ {DictionaryManagerRelationshipContainerOneToMany} from "./components/dictionarymanagerrelationshipcontaineronetomany";
import /*embed*/ {DictionaryManagerRelationshipAddManyToMany} from "./components/dictionarymanagerrelationshipaddmanytomany";
import /*embed*/ {DictionaryManagerRelationshipContainerManyToMany} from "./components/dictionarymanagerrelationshipcontainermanytomany";
import /*embed*/ {DictionaryManagerRelationshipAddParent} from "./components/dictionarymanagerrelationshipaddparent";
import /*embed*/ {DictionaryManagerRelationshipContainerParent} from "./components/dictionarymanagerrelationshipcontainerparent";
import /*embed*/ {DictionaryManagerIndexes} from "./components/dictionarymanagerindexes";
import /*embed*/ {DictionaryManagerIndexAdd} from "./components/dictionarymanagerindexadd";
import /*embed*/ {DictionaryManagerIndexDetails} from "./components/dictionarymanagerindexdetails";
import /*embed*/ {DictionaryManagerFields} from "./components/dictionarymanagerfields";


import /*embed*/ {DomainManager} from "./components/domainmanager";
import /*embed*/ {DomainManagerDefinitions} from "./components/domainmanagerdefinitions";
import /*embed*/ {DomainManagerFields} from "./components/domainmanagerfields";
import /*embed*/ {DomainManagerFieldTabs} from "./components/domainmanagerfieldtabs";
import /*embed*/ {DomainManagerFieldDetails} from "./components/domainmanagerfielddetails";
import /*embed*/ {DomainManagerFieldValidation} from "./components/domainmanagerfieldvalidation";
import /*embed*/ {DomainManagerAddDefinitionModal} from "./components/domainmanageradddefinitionmodal";
import /*embed*/ {DomainManagerAddFieldModal} from "./components/domainmanageraddfieldmodal";
import /*embed*/ {DomainManagerSelectValidation} from "./components/domainmanagerselectvalidation";
import /*embed*/ {DomainManagerAddValidation} from "./components/domainmanageraddvalidation";
import /*embed*/ {DomainManagerAddValidationValueModal} from "./components/domainmanageraddvalidationvaluemodal";

import /*embed*/ {FieldsetManager} from "./components/fieldsetmanager";
import /*embed*/ {FieldsetManagerFieldsetDetails} from "./components/fieldsetmanagerfieldsetdetails";
import /*embed*/ {FieldsetManagerFieldDetails} from "./components/fieldsetmanagerfielddetails";
import /*embed*/ {FieldsetManagerAddDialog} from "./components/fieldsetmanageradddialog";
import /*embed*/ {FieldsetManagerEditDialog} from "./components/fieldsetmanagereditdialog";

import /*embed*/ {ActionsetManager} from "./components/actionsetmanager";
import /*embed*/ {ActionsetManagerActionDetails} from "./components/actionsetmanageractiondetails";
import /*embed*/ {ActionsetManagerAddDialog} from "./components/actionsetmanageradddialog";

import /*embed*/ {ComponentsetManager} from "./components/componentsetmanager";
import /*embed*/ {ComponentsetManagerComponentsetDetails} from "./components/componentsetmanagercomponentsetdetails";

import /*embed*/ {ComponentsetManagerAddDialog} from "./components/componentsetmanageradddialog";
import /*embed*/ {ComponentsetManagerEditDialog} from "./components/componentsetmanagereditdialog";
import /*embed*/ {ValidationRulesManager, MaybeJsonPipe} from "./components/validationrulesmanager";
import /*embed*/ {ValidationRulesConditions} from "./components/validationrulesconditions";
import /*embed*/ {ValidationRulesActions} from "./components/validationrulesactions";
import /*embed*/ {LanguageTranslationsManager} from "./components/languagetranslationsmanager";
import /*embed*/ {LanguageLabelManagerComponent,SortPipe} from "./components/languagelabelmanager";
import /*embed*/ {LanguageLabelModal} from "./components/languagelabelmodal";
import /*embed*/ {MailboxesManager} from "./components/mailboxesmanager";
import /*embed*/ {MailboxesTransportsEnum} from "./components/mailboxestransportsenum";
import /*embed*/ {MailboxesmanagerTestModal} from "./components/mailboxesmanagertestmodal";
import /*embed*/ {MailboxesmanagerTestIMAPModal} from "./components/mailboxesmanagertestimapmodal";
import /*embed*/ {MailboxesGmailTrafficManager} from "./components/mailboxesgmailtrafficmanager";
import /*embed*/ {MailboxesMailgunTrafficManager} from "./components/mailboxesmailguntrafficmanager";
import /*embed*/ {MailboxesSendgridTrafficManager} from "./components/mailboxessendgridtrafficmanager";
import /*embed*/ {MailboxesTwillioTrafficManager} from "./components/mailboxestwilliotrafficmanager";
import /*embed*/ {MailboxesA1SmsTrafficManager} from "./components/mailboxesa1smstrafficmanager";
import /*embed*/ {MailboxesA1TrafficManager} from "./components/mailboxesa1trafficmanager";
import /*embed*/ {MailboxesEWSTrafficManager} from "./components/mailboxesewstrafficmanager";
import /*embed*/ {MailboxesEWSSelectFoldersModal} from "./components/mailboxesewsselectfoldersmodal";
import /*embed*/ {MailboxManagerAddDialog} from "./components/mailboxmanageradddialog";
import /*embed*/ {MailboxesIMAPSMTPSelectFoldersModal} from "./components/mailboxesimapsmtpselectfoldersmodal";
import /*embed*/ {MailboxesImapSmtpTrafficManager} from "./components/mailboxesimapsmtptrafficmanager";
import /*embed*/ {MailboxesTransportManager} from "./components/mailboxestransportmanager";
import /*embed*/ {MailboxesProcessors} from "./components/mailboxesprocessors";
import /*embed*/ {SelectTreeComponent} from "./components/selecttree";
import /*embed*/ {SelectTreeAddDialog} from "./components/selecttreeadddialog";
import /*embed*/ {ConfigCleaner} from "./components/configcleaner";
import /*embed*/ {StyleCacheCleaner} from "./components/stylecachecleaner";
import /*embed*/ {GoogleCalendarManager} from "./components/googlecalendarmanager";
import /*embed*/ {ConfigTransfer} from './components/configtransfer';

import /*embed*/ {ModuleConfigManager} from "./components/moduleconfigmanager";

import /*embed*/ {WorkbenchHeader} from "./components/workbenchheader";
import /*embed*/ {WorkbenchHeaderControls} from "./components/workbenchheadercontrols";
import /*embed*/ {WorkbenchConfig} from "./components/workbenchconfig";
import /*embed*/ {WorkbenchConfigLabel} from "./components/workbenchconfiglabel";
import /*embed*/ {ModuleConfigAddDialog} from "./components/moduleconfigadddialog";
import /*embed*/ {FieldsetManagerCopyDialog} from "./components/fieldsetmanagercopydialog";
import /*embed*/ {WorkbenchConfigOptionFieldset} from "./components/workbenchconfigoptionfieldset";
import /*embed*/ {WorkbenchConfigOptionModulefilter} from "./components/workbenchconfigoptionmodulefilter";
import /*embed*/ {WorkbenchConfigOptionActionset} from "./components/workbenchconfigoptionactionset";
import /*embed*/ {WorkbenchConfigOptionBoolean} from "./components/workbenchconfigoptionboolean";
import /*embed*/ {WorkbenchConfigOptionComponentset} from "./components/workbenchconfigoptioncomponentset";
import /*embed*/ {WorkbenchConfigOptionModule} from "./components/workbenchconfigoptionmodule";
import /*embed*/ {WorkbenchConfigOptionDefault} from "./components/workbenchconfigoptiondefault";
import /*embed*/ {WorkbenchConfigOptionLabel} from "./components/workbenchconfigoptionlabel";
import /*embed*/ {WorkbenchConfigOptionMethod} from "./components/workbenchconfigoptionmethod";
import /*embed*/ {ObjectRepositoryManager, ObjectRepositoryManagerFilter} from "./components/objectrepositorymanager";
import /*embed*/ {ObjectRepositoryManagerAddRepo} from "./components/objectrepositorymanageraddrepo";
import /*embed*/ {ObjectRepositoryManagerAddModule} from "./components/objectrepositorymanageraddmodule";
import /*embed*/ {ObjectRepositoryExport} from "./components/objectrepositoryexport";

import /*embed*/ {CRMLogViewer} from './components/crmlogviewer';
import /*embed*/ {CRMLogViewerList} from './components/crmlogviewerlist';
import /*embed*/ {CRMLogViewerModal} from './components/crmlogviewermodal';
import /*embed*/ {CRMLogViewerListModal} from './components/crmlogviewerlistmodal';

import /*embed*/ {KRESTLogViewer} from './components/krestlogviewer';
import /*embed*/ {KRESTLogViewerModal} from './components/krestlogviewermodal';

import /*embed*/ {ModuleFilterBuilder} from "./components/modulefilterbuilder";
import /*embed*/ {ModuleFilterBuilderFilters} from "./components/modulefilterbuilderfilters";
import /*embed*/ {ModuleFilterBuilderFilterDetails} from "./components/modulefilterbuilderfilterdetails";

import /*embed*/ {DashletGenerator} from "./components/dashletgenerator";
import /*embed*/ {DashletGeneratorDashlets} from "./components/dashletgeneratordashlets";
import /*embed*/ {DashletGeneratorDashletDetails} from "./components/dashletgeneratordashletdetails";

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
        DictionaryManagerAddItemModal,
        DictionaryManagerRelationships,
        DictionaryManagerRelationshipsDetails,
        DictionaryManagerRelationshipAdd,
        DictionaryManagerRelationshipAddOneToMany,
        DictionaryManagerRelationshipContainerOneToMany,
        DictionaryManagerRelationshipAddManyToMany,
        DictionaryManagerRelationshipContainerManyToMany,
        DictionaryManagerRelationshipAddParent,
        DictionaryManagerRelationshipContainerParent,
        DictionaryManagerIndexes,
        DictionaryManagerIndexAdd,
        DictionaryManagerIndexDetails,
        DictionaryManagerFields,
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
        MailboxesTwillioTrafficManager,
        MailboxesA1SmsTrafficManager,
        MailboxesA1TrafficManager,
        MailboxesEWSTrafficManager,
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
        KRESTLogViewer,
        KRESTLogViewerModal,
        ModuleFilterBuilder,
        ModuleFilterBuilderFilters,
        ModuleFilterBuilderFilterDetails,
        DashletGenerator,
        DashletGeneratorDashlets,
        DashletGeneratorDashletDetails,
        ConfigTransfer
    ],
    /* no further modules needed */
    entryComponents: [
        DomainManager,
        DictionaryManager,
        FieldsetManager,
        ComponentsetManager,
        WorkbenchConfigLabel,
        WorkbenchConfigOptionDefault,
        WorkbenchConfigOptionFieldset,
        WorkbenchConfigOptionModulefilter,
        WorkbenchConfigOptionComponentset,
        WorkbenchConfigOptionActionset,
        ModuleConfigManager,
        WorkbenchConfig,
        ObjectRepositoryManager,
        CRMLogViewer,
        CRMLogViewerList,
        CRMLogViewerModal,
        CRMLogViewerListModal,
        KRESTLogViewer,
        KRESTLogViewerModal,
        ConfigTransfer
    ],
    exports: [
        SortPipe
    ]
})
export class WorkbenchModule {}
