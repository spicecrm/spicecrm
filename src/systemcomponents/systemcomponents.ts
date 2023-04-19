/**
 * @module SystemComponents
 */
import {
    NgModule
} from "@angular/core";
import {DragDropModule} from '@angular/cdk/drag-drop';


// MODULEs
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../directives/directives";

// Pipes...
import {SystemModuleCustomPipe} from "./pipes/systemmodulecustompipe";
import {SystemModuleGlobalPipe} from "./pipes/systemmoduleglobalpipe";
import {SystemStripHtmlTagsPipe} from "./pipes/systemstriphtmltagspipe";

// COMPONENTs...
import {PaginationControlsComponent, PaginationPipe} from "./components/pagination";
import {SpeechRecognition} from "./components/speechrecognition";
import {SystemActionIcon} from "./components/systemactionicon";
import {SystemButtonCustomIcon} from "./components/systembuttoncustomicon";
import {SystemButtonGroup} from "./components/systembuttongroup";
import {SystemButtonIcon} from "./components/systembuttonicon";
import {SystemCard} from "./components/systemcard";
import {SystemCardHeader} from "./components/systemcardheader";
import {SystemCardBody} from "./components/systemcardbody";
import {SystemCardFooter} from "./components/systemcardfooter";
import {SystemCardStencil} from "./components/systemcardstencil";
import {SystemCheckboxGroup} from "./components/systemcheckboxgroup";
import {SystemCheckboxGroupCheckbox} from "./components/systemcheckboxgroupcheckbox";
import {SystemCheckbox} from "./components/systemcheckbox";
import {SystemCheckboxToggle} from "./components/systemcheckboxtoggle";
import {SystemCollabsableTab} from "./components/systemcollabsabletab";
import {SystemComponentContainer} from "./components/systemcomponentcontainer";
import {SystemComponentMissing} from "./components/systemcomponentmissing";
import {SystemComponentSet} from "./components/systemcomponentset";
import {SystemConfirmDialog} from "./components/systemconfirmdialog";
import {SystemCustomIcon} from "./components/systemcustomicon";
import {SystemDisplayDatetime} from "./components/systemdisplaydatetime";
import {SystemDisplayNumber} from "./components/systemdisplaynumber";
import {SystemDynamicComponent} from "./components/systemdynamiccomponent";
import {SystemDynamicRouteContainer} from "./components/systemdynamicroutecontainer";
import {SystemDynamicRouteInterceptor} from "./components/systemdynamicrouteinterceptor";
import {SystemGooglePlacesAutocomplete} from "./components/systemgoogleplacesautocomplete";
import {SystemGooglePlacesSearch} from "./components/systemgoogleplacessearch";
import {SystemIcon} from "./components/systemicon";
import {SystemFileIcon} from "./components/systemfileicon";
import {SystemIllustrationNoAccess} from "./components/systemillustrationnoaccess";
import {SystemIllustrationNoData} from "./components/systemillustrationnodata";
import {SystemIllustrationNoRecords} from "./components/systemillustrationnorecords";
import {SystemIllustrationNoTask} from "./components/systemillustrationnotask";
import {SystemIllustrationPageNotAvailable} from "./components/systemillustrationpagenotavailable";
import {SystemImagePreviewModal} from "./components/systemimagepreviewmodal";
import {SystemInputText} from "./components/systeminputtext";
import {SystemInputEnum} from "./components/systeminputenum";
import {SystemInputMultiEnum} from "./components/systeminputmultienum";
import {SystemInputInteger} from "./components/systeminputinteger";
import {SystemInputActionset} from "./components/systeminputactionset";
import {SystemInputComponentset} from "./components/systeminputcomponentset";
import {SystemInputCountry} from "./components/systeminputcountry";
import {SystemInputCountryCode} from "./components/systeminputcountrycode";
import {SystemInputDatePicker} from "./components/systeminputdatepicker";
import {SystemInputDate} from "./components/systeminputdate";
import {SystemInputDelayed} from "./components/systeminputdelayed";
import {SystemInputFieldset} from "./components/systeminputfieldset";
import {SystemInputLabel} from "./components/systeminputlabel";
import {SystemInputModule} from "./components/systeminputmodule";
import {SystemInputModuleFilter} from "./components/systeminputmodulefilter";
import {SystemInputModuleField} from "./components/systeminputmodulefield";
import {SystemInputNumber} from "./components/systeminputnumber";
import {SystemInputPassword} from "./components/systeminputpassword";
import {SystemInputRadio} from "./components/systeminputradio";
import {SystemInputRadioButtonGroup} from "./components/systeminputradiobuttongroup";
import {SystemInputRelate} from "./components/systeminputrelate";
import {SystemInputState} from "./components/systeminputstate";
import {SystemInputTags} from "./components/systeminputtags";
import {SystemInputTime} from "./components/systeminputtime";
import {SystemInputCompanycodes} from "./components/systeminputcompanycodes";
import {SystemInputBackendMethod} from "./components/systeminputbackendmethod";
import {SystemInstallerComponent} from "./components/systeminstallercomponent";
import {SystemLabel} from "./components/systemlabel";
import {SystemLabelEditorModal} from "./components/systemlabeleditormodal";
import {SystemLabelEditorGlobalCustomModal} from "./components/systemlabeleditorglobalcustommodal";
import {SystemLabelFieldname} from "./components/systemlabelfieldname";
import {SystemLabelModulename} from "./components/systemlabelmodulename";
import {SystemLanguageSelector} from "./components/systemlanguageselector";
import {SystemLink} from "./components/systemlink";
import {SystemLoaderProgress} from "./components/systemloaderprogress";
import {SystemLoadingModal} from "./components/systemloadingmodal";
import {SystemModalContent} from "./components/systemmodalcontent";
import {SystemModalFooter} from "./components/systemmodalfooter";
import {SystemModalHeaderRight} from "./components/systemmodalheaderright";
import {SystemModalHeaderTagline} from "./components/systemmodalheadertagline";
import {SystemModalHeader} from "./components/systemmodalheader";
import {SystemModalHeaderEmpty} from "./components/systemmodalheaderempty";
import {SystemModalWrapper} from "./components/systemmodalwrapper";
import {SystemModal} from "./components/systemmodal";
import {SystemNumberSpinner} from "./components/systemnumberspinner";
import {SystemObjectPreviewModal} from "./components/systemobjectpreviewmodal";
import {SystemProgressList} from "./components/systemprogresslist";
import {SystemProgressRing} from "./components/systemprogressring";
import {SystemProgressBar} from "./components/systemprogressbar";
import {SystemPrompt} from "./components/systemprompt";
import {SystemRichTextEditor} from "./components/systemrichtexteditor";
import {SystemRichTextLink} from "./components/systemrichtextlink";
import {SystemRichTextSourceModal} from "./components/systemrichtextsourcemodal";
import {SystemRoleSelector} from "./components/systemroleselector";
import {SystemSection} from "./components/systemsection";
import {SystemSelect} from "./components/systemselect";
import {SystemSelectIcon, } from "./components/systemselecticon";
import {SystemSelectIconItem} from "./components/systemselecticonitem";
import {SystemSelectUOM} from "./components/systemselectuom";
import {SystemSpinner} from "./components/systemspinner";
import {SystemSplitView} from "./components/systemsplitview";
import {SystemStencil} from "./components/systemstencil";
import {SystemTableStencils} from "./components/systemtablestencils";
import {SystemSearchresultStencil} from "./components/systemsearchresultstencil";
import {SystemTinyMCEModal} from "./components/systemtinymcemodal";
import {SystemTinyMCE} from "./components/systemtinymce";
import {SystemToastContainer} from "./components/systemtoastcontainer";
import {SystemTooltip} from "./components/systemtooltip";
import {SystemTreeItem} from "./components/systemtreeitem";
import {SystemTree} from "./components/systemtree";
import {SystemUploadImage} from "./components/systemuploadimage";
import {SystemPopover} from "./components/systempopover";
import {SystemUtilityIcon} from "./components/systemutilityicon";
import {SystemViewContainer} from "./components/systemviewcontainer";
import {SystemIconHelpText} from "./components/systemiconhelptext";
import {SystemMultipleSelect} from "./components/systemmultipleselect";
import {SystemWrappedText} from './components/systemwrappedtext';

import {PackageLoader} from "./components/packageloader";
import {PackageLoaderPipe} from "./components/packageloaderpipe";
import {PackageLoaderPackages} from "./components/packageloaderpackages";
import {PackageLoaderPackage} from "./components/packageloaderpackage";
import {PackageLoaderLanguages} from "./components/packageloaderlanguages";
import {PackageLoaderLanguage} from "./components/packageloaderlanguage";

import {SystemFilterBuilder} from "./components/systemfilterbuilder";
import {SystemFilterBuilderFilterExpressionFields} from "./components/systemfilterbuilderfilterexpressionfields";
import {SystemFilterBuilderFilterExpressionValue} from "./components/systemfilterbuilderfilterexpressionvalue";
import {SystemFilterBuilderFilterExpressionValues} from "./components/systemfilterbuilderfilterexpressionvalues";
import {SystemFilterBuilderFilterExpression} from "./components/systemfilterbuilderfilterexpression";
import {SystemFilterBuilderFilterExpressionGroup} from "./components/systemfilterbuilderfilterexpressiongroup";

import {SystemInputMedia} from './components/systeminputmedia';
import {SystemInputTimezone} from './components/systeminputtimezone';
import {SystemInputBase64} from './components/systeminputbase64';
import {SystemInputFile} from './components/systeminputfile';
import {SystemInputFileContent} from './components/systeminputfilecontent';

import {SystemModuleTree} from "./components/systemmoduletree";
import {SystemModuleTreeItem} from "./components/systemmoduletreeitem";
import {SystemTrendIndicator} from "./components/systemtrendindicator";
import {SystemImageModal} from './components/systemimagemodal';
import {SystemSlider} from "./components/systemslider";

import {SystemNavigationCollector} from "./components/systemnavigationcollector";
import {SystemNavigationManager} from "./components/systemnavigationmanager";
import {SystemNavigationManagerRouteContainer} from "./components/systemnavigationmanagerroutecontainer";

import {SystemPreferencesPanel} from "./components/systempreferencespanel";
import {SystemPreferencesPanelItem} from "./components/systempreferencespanelitem";
import {SystemPreferencesPanelItemDisplay} from "./components/systempreferencespanelitemdisplay";
import {SystemPreferencesPanelItemEdit} from "./components/systempreferencespanelitemedit";
import {SystemPDFContainer} from "./components/systempdfcontainer";
import {SystemIframeModal} from "./components/systemiframemodal";
import {SystemInputColor} from "./components/systeminputcolor";
import {SystemRichTextEditorContent} from "./components/systemrichtexteditorcontent";
import {SystemHtmlEditor} from "./components/systemhtmleditor";

@NgModule({
    imports: [
        DirectivesModule,
        CommonModule,
        FormsModule,
        DragDropModule
    ],
    declarations: [
        PackageLoader,
        PackageLoaderLanguage,
        PackageLoaderLanguages,
        PackageLoaderPackage,
        PackageLoaderPackages,
        PackageLoaderPipe,
        PaginationControlsComponent,
        PaginationPipe,
        SpeechRecognition,
        SystemActionIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemButtonIcon,
        SystemCard,
        SystemCardBody,
        SystemCardFooter,
        SystemCardHeader,
        SystemCardStencil,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCheckboxToggle,
        SystemCollabsableTab,
        SystemComponentContainer,
        SystemComponentMissing,
        SystemComponentSet,
        SystemConfirmDialog,
        SystemCustomIcon,
        SystemDisplayDatetime,
        SystemDisplayNumber,
        SystemDynamicComponent,
        SystemDynamicRouteContainer,
        SystemDynamicRouteInterceptor,
        SystemGooglePlacesAutocomplete,
        SystemGooglePlacesSearch,
        SystemIcon,
        SystemFileIcon,
        SystemIframeModal,
        SystemIllustrationNoAccess,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemIllustrationNoTask,
        SystemIllustrationPageNotAvailable,
        SystemImagePreviewModal,
        SystemInputText,
        SystemInputInteger,
        SystemInputEnum,
        SystemInputMultiEnum,
        SystemInputActionset,
        SystemInputColor,
        SystemInputComponentset,
        SystemInputCountry,
        SystemInputCountryCode,
        SystemInputDate,
        SystemInputDatePicker,
        SystemInputDelayed,
        SystemInputFieldset,
        SystemInputLabel,
        SystemInputModule,
        SystemInputModuleFilter,
        SystemInputModuleField,
        SystemInputNumber,
        SystemInputPassword,
        SystemInputRadio,
        SystemInputRadioButtonGroup,
        SystemInputRelate,
        SystemInputState,
        SystemInputTags,
        SystemInputTime,
        SystemInputCompanycodes,
        SystemInputBackendMethod,
        SystemInputBase64,
        SystemInstallerComponent,
        SystemLabel,
        SystemLabelFieldname,
        SystemLabelModulename,
        SystemLanguageSelector,
        SystemLink,
        SystemLoaderProgress,
        SystemLoadingModal,
        SystemModal,
        SystemModalContent,
        SystemModalFooter,
        SystemModalHeader,
        SystemModalHeaderEmpty,
        SystemModalHeaderRight,
        SystemModalHeaderTagline,
        SystemModalWrapper,
        SystemModuleCustomPipe,
        SystemModuleGlobalPipe,
        SystemNumberSpinner,
        SystemObjectPreviewModal,
        SystemPDFContainer,
        SystemInputModuleFilter,
        SystemFilterBuilder,
        SystemFilterBuilderFilterExpressionGroup,
        SystemFilterBuilderFilterExpression,
        SystemFilterBuilderFilterExpressionFields,
        SystemFilterBuilderFilterExpressionValues,
        SystemFilterBuilderFilterExpressionValue,
        SystemPopover,
        SystemProgressList,
        SystemProgressRing,
        SystemProgressBar,
        SystemPrompt,
        SystemRichTextEditor,
        SystemRichTextSourceModal,
        SystemRichTextLink,
        SystemRoleSelector,
        SystemSection,
        SystemSelect,
        SystemSelectIcon,
        SystemSelectIconItem,
        SystemSelectUOM,
        SystemSpinner,
        SystemSplitView,
        SystemStencil,
        SystemSearchresultStencil,
        SystemTableStencils,
        SystemTinyMCE,
        SystemTinyMCEModal,
        SystemToastContainer,
        SystemTooltip,
        SystemTree,
        SystemTreeItem,
        SystemUploadImage,
        SystemUtilityIcon,
        SystemViewContainer,
        SystemIconHelpText,
        SystemMultipleSelect,
        SystemModuleTree,
        SystemModuleTreeItem,
        SystemInputMedia,
        SystemInputTimezone,
        SystemTrendIndicator,
        SystemSlider,
        SystemTrendIndicator,
        SystemImageModal,
        SystemNavigationCollector,
        SystemNavigationManager,
        SystemNavigationManagerRouteContainer,
        SystemLabelEditorModal,
        SystemLabelEditorGlobalCustomModal,
        SystemPreferencesPanel,
        SystemPreferencesPanelItem,
        SystemPreferencesPanelItemDisplay,
        SystemPreferencesPanelItemEdit,
        SystemInputFile,
        SystemInputFileContent,
        SystemWrappedText,
        SystemRichTextEditorContent,
        SystemHtmlEditor,
        SystemStripHtmlTagsPipe
    ],
    exports: [
        PaginationControlsComponent,
        PaginationPipe,
        SystemStripHtmlTagsPipe,
        SpeechRecognition,
        SystemActionIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemButtonIcon,
        SystemCard,
        SystemCardBody,
        SystemCardFooter,
        SystemCardHeader,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCheckboxToggle,
        SystemCollabsableTab,
        SystemComponentMissing,
        SystemComponentSet,
        SystemCustomIcon,
        SystemDisplayDatetime,
        SystemDisplayNumber,
        SystemDynamicComponent,
        SystemFilterBuilderFilterExpression,
        SystemFilterBuilderFilterExpressionFields,
        SystemFilterBuilderFilterExpressionValues,
        SystemFilterBuilderFilterExpressionGroup,
        SystemGooglePlacesAutocomplete,
        SystemGooglePlacesSearch,
        SystemIcon,
        SystemFileIcon,
        SystemIllustrationNoAccess,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemIllustrationNoTask,
        SystemIllustrationPageNotAvailable,
        SystemInputText,
        SystemInputInteger,
        SystemInputEnum,
        SystemInputMultiEnum,
        SystemInputActionset,
        SystemInputComponentset,
        SystemInputCountry,
        SystemInputCountryCode,
        SystemInputDate,
        SystemInputDatePicker,
        SystemInputDelayed,
        SystemInputFieldset,
        SystemInputLabel,
        SystemInputModule,
        SystemInputModuleFilter,
        SystemInputModuleField,
        SystemInputNumber,
        SystemInputPassword,
        SystemInputRadio,
        SystemInputRadioButtonGroup,
        SystemInputRelate,
        SystemInputState,
        SystemInputTags,
        SystemInputTime,
        SystemInputCompanycodes,
        SystemInputBackendMethod,
        SystemInputBase64,
        SystemInstallerComponent,
        SystemLabel,
        SystemLabelFieldname,
        SystemLabelModulename,
        SystemLanguageSelector,
        SystemLink,
        SystemLoaderProgress,
        SystemModal,
        SystemModalContent,
        SystemModalFooter,
        SystemModalHeader,
        SystemModalHeaderEmpty,
        SystemModalHeaderRight,
        SystemModalHeaderTagline,
        SystemModalWrapper,
        SystemNumberSpinner,
        SystemProgressList,
        SystemProgressRing,
        SystemProgressBar,
        SystemPrompt,
        SystemRichTextEditor,
        SystemRoleSelector,
        SystemSection,
        SystemSelect,
        SystemSpinner,
        SystemSplitView,
        SystemStencil,
        SystemSearchresultStencil,
        SystemTableStencils,
        SystemTinyMCE,
        SystemToastContainer,
        SystemTooltip,
        SystemTree,
        SystemTreeItem,
        SystemUtilityIcon,
        SystemViewContainer,
        SystemIconHelpText,
        SystemMultipleSelect,
        SystemInputModuleFilter,
        SystemFilterBuilder,
        SystemFilterBuilderFilterExpressionGroup,
        SystemFilterBuilderFilterExpression,
        SystemSelectUOM,
        SystemInputMedia,
        SystemSelectUOM,
        SystemModuleTree,
        SystemModuleTreeItem,
        SystemInputTimezone,
        SystemTrendIndicator,
        SystemSlider,
        SystemTrendIndicator,
        SystemImageModal,
        SystemNavigationCollector,
        SystemNavigationManager,
        SystemInputCountry,
        SystemInputState,
        SystemPreferencesPanel,
        SystemPreferencesPanelItem,
        SystemPreferencesPanelItemDisplay,
        SystemPreferencesPanelItemEdit,
        SystemInputFile,
        SystemInputFileContent,
        SystemModalHeaderEmpty,
        SystemWrappedText,
        SystemPDFContainer,
        SystemInputColor,
        SystemLabelEditorModal,
        SystemHtmlEditor,
        SystemCardStencil,
        SystemSelectIcon,
        SystemSelectIconItem
    ]
})
export class SystemComponents {}
