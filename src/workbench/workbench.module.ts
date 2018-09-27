import {CommonModule, JsonPipe} from "@angular/common";
import {AfterViewInit,  Component, ElementRef, NgModule, Renderer,  ViewChild, ViewContainerRef, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, Pipe, PipeTransform, ChangeDetectorRef} from "@angular/core";
import {FormsModule}   from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";

import {Subject} from "rxjs";
import {Observable} from "rxjs";
// SERVICEs
import {metadata} from "../services/metadata.service";
import {model} from "../services/model.service";
import {modal} from "../services/modal.service";
import {language} from "../services/language.service";
import {broadcast} from "../services/broadcast.service";
import {backend} from "../services/backend.service";
import {view} from "../services/view.service";
import {popup} from "../services/popup.service";
import {navigation} from "../services/navigation.service";
import {modelutilities} from "../services/modelutilities.service";
import {toast} from "../services/toast.service";
import {AppDataService} from "../services/appdata.service";
import {VersionManagerService} from "../services/versionmanager.service";
import {configurationService} from "../services/configuration.service";
import {footer} from "../services/footer.service";

// MODULEs
import {SystemComponents}      from "../systemcomponents/systemcomponents";
import {GlobalUtilityComponents}      from "../globalutilitycomponents/globalutilitycomponents";
import {DirectivesModule} from "../directives/directives";
import {ObjectFields} from "../objectfields/objectfields";

// COMPONENTs

import /*embed*/ {BasicReferenceForm} from "./components/basicreferenceform";

import /*embed*/ {DomainManager} from "./components/domainmanager";
import /*embed*/ {DomainManagerFieldDetails} from "./components/domainmanagerfielddetails";

import /*embed*/ {DictionaryManager} from "./components/dictionarymanager";
import /*embed*/ {DictionaryManagerItem} from "./components/dictionarymanageritem";
import /*embed*/ {DictionaryManagerItemString} from "./components/dictionarymanageritemstring";
import /*embed*/ {DictionaryManagerItemDomain} from "./components/dictionarymanageritemdomain";

import /*embed*/ {FieldsetManager} from "./components/fieldsetmanager";
import /*embed*/ {FieldsetManagerFieldsetDetails} from "./components/fieldsetmanagerfieldsetdetails";
import /*embed*/ {FieldsetManagerFieldDetails} from "./components/fieldsetmanagerfielddetails";
import /*embed*/ {FieldsetManagerAddDialog} from "./components/fieldsetmanageradddialog";
import /*embed*/ {FieldsetManagerEditDialog} from "./components/fieldsetmanagereditdialog";

import /*embed*/ {ComponentsetManager} from "./components/componentsetmanager";
import /*embed*/ {ComponentsetManagerComponentsetDetails} from "./components/componentsetmanagercomponentsetdetails";

import /*embed*/ {ComponentsetManagerAddDialog} from "./components/componentsetmanageradddialog";
import /*embed*/ {ComponentsetManagerEditDialog} from "./components/componentsetmanagereditdialog";
import /*embed*/ {ComponentConfigManager} from "./components/componentconfigmanager";
import /*embed*/ {ComponentConfigManagerComponentDetails} from "./components/componentconfigmanagercomponentdetails";
import /*embed*/ {ValidationRulesManager, MaybeJsonPipe} from "./components/validationrulesmanager";
import /*embed*/ {ValidationRulesConditions} from "./components/validationrulesconditions";
import /*embed*/ {ValidationRulesActions} from "./components/validationrulesactions";
import /*embed*/ {LanguageLabelManagerComponent,SortPipe} from "./components/languagelabelmanager";
import /*embed*/ {LanguageLabelModal} from "./components/languagelabelmodal";
import /*embed*/ {MailboxesManager} from "./components/mailboxesmanager";
import /*embed*/ {MailboxesManagerTestEmailModal} from "./components/mailboxesmanagertestemailmodal";
import /*embed*/ {MailboxesMailgunTrafficManager} from "./components/mailboxesmailguntrafficmanager";
import /*embed*/ {MailboxesSendgridTrafficManager} from "./components/mailboxessendgridtrafficmanager";
import /*embed*/ {MailboxManagerAddDialog} from "./components/maixlboxmanageradddialog";
import /*embed*/ {MailboxFoldersModalComponent} from "./components/mailboxfoldersmodalcomponent";
import /*embed*/ {LabelSelectorComponent} from "./components/labelselector";
import /*embed*/ {ServiceCategoryManagerComponent} from "./components/servicecategorymanager";
import /*embed*/ {MailboxesImapSmtpTrafficManager} from "./components/mailboxesimapsmtptrafficmanager";
import /*embed*/ {LanguageLabelReferenceConfigForm} from "./components/languagelabelreferenceconfigform";
import /*embed*/ {LanguageLabelReferenceConfigModal} from "./components/languagelabelreferenceconfigmodal";
import /*embed*/ {ReferenceConfigManager} from "./components/referenceconfigmanager";
import /*embed*/ {ReferenceConfigForm} from "./components/referenceconfigform";
import /*embed*/ {MailboxesProcessors} from "./components/mailboxesprocessors";
import /*embed*/ {SelectTreeComponent} from "./components/selecttree";
import /*embed*/ {SelectTreeAddDialog} from "./components/selecttreeadddialog";
import /*embed*/ {ConfigCleaner} from "./components/configcleaner";
import /*embed*/ {GoogleCalendarManager} from "./components/googlecalendarmanager";


import /*embed*/ {ModuleConfigManager} from "./components/moduleconfigmanager";

import /*embed*/ {WorkbenchConfig} from "./components/workbenchconfig";
import /*embed*/ {ModuleConfigAddDialog} from "./components/moduleconfigadddialog";
import /*embed*/ {FieldsetManagerCopyDialog} from "./components/fieldsetmanagercopydialog";
import /*embed*/ {WorkbenchConfigOptionFieldset, ComponentsetManagerModulePipe} from "./components/workbenchconfigoptionfieldset";
import /*embed*/ {WorkbenchConfigOptionActionset} from "./components/workbenchconfigoptionactionset";
import /*embed*/ {WorkbenchConfigOptionBoolean} from "./components/workbenchconfigoptionboolean";
import /*embed*/ {WorkbenchConfigOptionComponentset} from "./components/workbenchconfigoptioncomponentset";
import /*embed*/ {WorkbenchConfigOptionModule} from "./components/workbenchconfigoptionmodule";
import /*embed*/ {WorkbenchConfigOptionDefault} from "./components/workbenchconfigoptiondefault";
import /*embed*/ {ObjectRepositoryManager} from "./components/objectrepositorymanager";
import /*embed*/ {ObjectRepositoryManagerAddRepo} from "./components/objectrepositorymanageraddrepo";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GlobalUtilityComponents,
        SystemComponents,
        DirectivesModule,
        ObjectFields
    ],
    declarations: [
        DomainManager,
        DomainManagerFieldDetails,
        DictionaryManager,
        DictionaryManagerItem,
        DictionaryManagerItemString,
        DictionaryManagerItemDomain,
        FieldsetManager,
        FieldsetManagerFieldsetDetails,
        FieldsetManagerFieldDetails,
        FieldsetManagerAddDialog,
        FieldsetManagerEditDialog,
        FieldsetManagerCopyDialog,
        ComponentsetManager,
        ComponentsetManagerComponentsetDetails,
        WorkbenchConfigOptionDefault,
        WorkbenchConfigOptionFieldset,
        ComponentsetManagerModulePipe,
        WorkbenchConfigOptionComponentset,
        WorkbenchConfigOptionModule,
        WorkbenchConfigOptionActionset,
        WorkbenchConfigOptionBoolean,
        ComponentsetManagerAddDialog,
        ComponentsetManagerEditDialog,
        ComponentConfigManager,
        ComponentConfigManagerComponentDetails,
        ValidationRulesManager,
        ValidationRulesConditions,
        ValidationRulesActions,
        MaybeJsonPipe,
        LanguageLabelManagerComponent,
        LanguageLabelModal,
        LanguageLabelReferenceConfigForm,
        LanguageLabelReferenceConfigModal,
        ComponentConfigManagerComponentDetails,
        MailboxesManager,
        LanguageLabelModal,
        MailboxManagerAddDialog,
        MailboxesManagerTestEmailModal,
        MailboxesImapSmtpTrafficManager,
        MailboxesMailgunTrafficManager,
        MailboxesSendgridTrafficManager,
        MailboxFoldersModalComponent,
        SortPipe,
        LabelSelectorComponent,
        ServiceCategoryManagerComponent,
        ReferenceConfigManager,
        ReferenceConfigForm,
        MailboxesProcessors,
        SelectTreeComponent,
        SelectTreeAddDialog,
        ModuleConfigManager,
        ModuleConfigAddDialog,
        WorkbenchConfig,
        ConfigCleaner,
        GoogleCalendarManager,
        ObjectRepositoryManager,
        ObjectRepositoryManagerAddRepo
    ],
    /* no further modules needed */
    entryComponents: [
        DomainManager,
        DictionaryManager,
        FieldsetManager,
        ComponentsetManager,
        WorkbenchConfigOptionDefault,
        WorkbenchConfigOptionFieldset,
        WorkbenchConfigOptionComponentset,
        WorkbenchConfigOptionActionset,
        ComponentConfigManager,
        ModuleConfigManager,
        WorkbenchConfig,
        ObjectRepositoryManager
    ],
    exports: [
        SortPipe,
    ]
})
export class WorkbenchModule {
    private readonly version = "1.0";
    private readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        vms.registerModule(this);
    }
}