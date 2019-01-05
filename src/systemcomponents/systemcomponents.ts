import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    Output,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit,
    OnDestroy,
    EventEmitter,
    ElementRef,
    ChangeDetectorRef,
    ApplicationRef,
    Pipe,
    forwardRef,
    Directive,
    Renderer2,
    SimpleChanges,
    OnChanges,
    Host,
    Injectable,
    Inject
} from "@angular/core";
import {Subject} from "rxjs";
import {Observable} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DOCUMENT} from "@angular/common";
import {DomSanitizer} from '@angular/platform-browser';

// MODULEs
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../directives/directives";
// SERVICEs
import {ActivatedRoute, Router} from "@angular/router";
import {metadata} from "../services/metadata.service";
import {toast} from "../services/toast.service";
import {language} from "../services/language.service";
import {backend} from "../services/backend.service";
import {VersionManagerService} from "../services/versionmanager.service";
import {configurationService} from "../services/configuration.service";
import {modal} from "../services/modal.service";
import {userpreferences} from "../services/userpreferences.service";
import {loader} from "../services/loader.service";
import {modelutilities} from "../services/modelutilities.service";
import {broadcast} from "../services/broadcast.service";


import /*embed*/ {systemrichtextservice} from "./services/systemrichtext.service";

// COMPONENTs...
import /*embed*/ {SystemIcon} from "./components/systemicon";
import /*embed*/ {SystemComponentContainer} from "./components/systemcomponentcontainer";
import /*embed*/ {SystemDynamicComponent} from "./components/systemdynamiccomponent";
import /*embed*/ {SystemUtilityIcon} from "./components/systemutilityicon";
import /*embed*/ {SystemStencil} from "./components/systemstencil";
import /*embed*/ {SystemTableStencils} from "./components/systemtablestencils";
import /*embed*/ {SystemSpinner} from "./components/systemspinner";
import /*embed*/ {SystemComponentMissing} from "./components/systemcomponentmissing";
import /*embed*/ {SystemDynamicRouteContainer} from "./components/systemdynamicroutecontainer";
import /*embed*/ {SystemTooltip} from "./components/systemtooltip";
import /*embed*/ {SystemToastContainer} from "./components/systemtoastcontainer";
import /*embed*/ {SystemButtonIcon} from "./components/systembuttonicon";
import /*embed*/ {SystemButtonCustomIcon} from "./components/systembuttoncustomicon";
import /*embed*/ {SystemButtonGroup} from "./components/systembuttongroup";
import /*embed*/ {SystemActionIcon} from "./components/systemactionicon";
import /*embed*/ {SystemConfirmDialog} from "./components/systemconfirmdialog";
import /*embed*/ {SystemTinyMCE} from "./components/systemtinymce";
import /*embed*/ {SystemTinyMCEModal} from "./components/systemtinymcemodal";
import /*embed*/ {SystemCaptureImage} from "./components/systemcaptureimage";
import /*embed*/ {SpeechRecognition} from "./components/speechrecognition";
import /*embed*/ {PaginationControlsComponent, PaginationPipe} from "./components/pagination";
import /*embed*/ {SystemPrompt} from "./components/systemprompt";
import /*embed*/ {SystemModalWrapper} from "./components/systemmodalwrapper";
import /*embed*/ {SystemLoadingModal} from "./components/systemloadingmodal";
import /*embed*/ {SystemLink} from "./components/systemlink";
import /*embed*/ {SystemModal} from "./components/systemmodal";
import /*embed*/ {SystemModalHeader} from "./components/systemmodalheader";
import /*embed*/ {SystemModalContent} from "./components/systemmodalcontent";
import /*embed*/ {SystemModalFooter} from "./components/systemmodalfooter";
import /*embed*/ {SystemCollabsableTab} from "./components/systemcollabsabletab";
import /*embed*/ {SystemCustomIcon} from "./components/systemcustomicon";
import /*embed*/ {SystemCheckbox} from "./components/checkbox";
import /*embed*/ {SystemCard, SystemCardBody, SystemCardFooter, SystemCardHeaderTitle} from "./components/card";
import /*embed*/ {SystemTree} from "./components/systemtree";
import /*embed*/ {SystemTreeItem} from "./components/systemtreeitem";
import /*embed*/ {SystemSelect} from "./components/systemselect";
import /*embed*/ {SystemCheckboxGroup, SystemCheckboxGroupCheckbox} from "./components/systemcheckboxgroup";
import /*embed*/ {SystemSection} from "./components/systemsection";
import /*embed*/ {SystemRichTextEditor} from "./components/systemrichtexteditor";
import /*embed*/ {SystemRichTextSourceModal} from "./components/systemrichtextsourcemodal";
import /*embed*/ {SystemInputTime} from "./components/systeminputtime";
import /*embed*/ {SystemInputDate} from "./components/systeminputdate";
import /*embed*/ {SystemInputDatePicker} from "./components/systeminputdatepicker";
import /*embed*/ {SystemGoogleplacesSearch} from "./components/systemgoogleplacessearch";
import /*embed*/ {SystemComponentSet} from "./components/systemcomponentset";
import /*embed*/ {SystemProgressRing} from "./components/systemprogressring";
import /*embed*/ {SystemLoaderProgress} from "./components/systemloaderprogress";
import /*embed*/ {SystemIllustrationNoAccess} from "./components/systemillustrationnoaccess";
import /*embed*/ {SystemIllustrationNoTask} from "./components/systemillustrationnotask";
import /*embed*/ {SystemIllustrationNoData} from "./components/systemillustrationnodata";
import /*embed*/ {SystemIllustrationNoRecords} from "./components/systemillustrationnorecords";
import /*embed*/ {SystemInputLabel} from "./components/systeminputlabel";

import /*embed*/ {PackageLoader} from "./components/packageloader";
import /*embed*/ {PackageLoaderPipe} from "./components/packageloaderpipe";
import /*embed*/ {PackageLoaderPackages} from "./components/packageloaderpackages";
import /*embed*/ {PackageLoaderPackage} from "./components/packageloaderpackage";
import /*embed*/ {PackageLoaderLanguages} from "./components/packageloaderlanguages";
import /*embed*/ {PackageLoaderLanguage} from "./components/packageloaderlanguage";

@NgModule({
    imports: [
        DirectivesModule,
        CommonModule,
        FormsModule
    ],
    declarations: [
        SystemIcon,
        SystemComponentContainer,
        SystemDynamicComponent,
        SystemUtilityIcon,
        SystemStencil,
        SystemTableStencils,
        SystemSpinner,
        SystemComponentMissing,
        SystemDynamicRouteContainer,
        SystemTooltip,
        SystemToastContainer,
        SystemButtonIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemActionIcon,
        SystemConfirmDialog,
        SystemTinyMCE,
        SystemTinyMCEModal,
        SpeechRecognition,
        SystemCaptureImage,
        PaginationControlsComponent,
        PaginationPipe,
        SystemPrompt,
        SystemModalWrapper,
        SystemLoadingModal,
        SystemModal,
        SystemModalHeader,
        SystemModalContent,
        SystemModalFooter,
        SystemCollabsableTab,
        SystemLink,
        SystemCustomIcon,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCard,
        SystemCardHeaderTitle,
        SystemCardBody,
        SystemCardFooter,
        SystemTree,
        SystemTreeItem,
        SystemSelect,
        SystemSection,
        SystemRichTextEditor,
        SystemRichTextSourceModal,
        SystemInputTime,
        SystemInputDate,
        SystemInputDatePicker,
        SystemGoogleplacesSearch,
        SystemComponentSet,
        SystemProgressRing,
        SystemLoaderProgress,
        PackageLoader,
        PackageLoaderPipe,
        PackageLoaderPackages,
        PackageLoaderPackage,
        PackageLoaderLanguages,
        PackageLoaderLanguage,
        SystemIllustrationNoAccess,
        SystemIllustrationNoTask,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemInputLabel
    ],
    entryComponents: [
        SystemDynamicRouteContainer
    ],
    exports: [
        SystemIcon,
        SystemUtilityIcon,
        SystemStencil,
        SystemTableStencils,
        SystemSpinner,
        SystemDynamicComponent,
        SystemComponentMissing,
        SystemTooltip,
        SystemToastContainer,
        SystemButtonIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemActionIcon,
        SystemTinyMCE,
        SpeechRecognition,
        PaginationControlsComponent,
        PaginationPipe,
        SystemPrompt,
        SystemModalWrapper,
        SystemModal,
        SystemModalHeader,
        SystemModalContent,
        SystemModalFooter,
        SystemCollabsableTab,
        SystemLink,
        SystemCustomIcon,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCard,
        SystemCardHeaderTitle,
        SystemCardBody,
        SystemCardFooter,
        SystemTree,
        SystemTreeItem,
        SystemSelect,
        SystemSection,
        SystemRichTextEditor,
        SystemInputTime,
        SystemInputDate,
        SystemInputDatePicker,
        SystemGoogleplacesSearch,
        SystemStencil,
        SystemComponentSet,
        SystemProgressRing,
        SystemLoaderProgress,
        SystemIllustrationNoAccess,
        SystemIllustrationNoTask,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemInputLabel
    ]
})
export class SystemComponents {
    private readonly version = "1.0";
    private readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}