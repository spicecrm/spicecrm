/**
 * @module ObjectFields
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {DragDropModule} from "@angular/cdk/drag-drop";

import {metadata} from '../services/metadata.service';

import {SystemComponents} from '../systemcomponents/systemcomponents';
import {DirectivesModule} from "../directives/directives";

import {fieldGeneric} from './components/fieldgeneric';
import {fieldSet} from './components/fieldset';
import {field} from './components/field';
import {fieldBlank} from './components/fieldblank';
import {fieldLabel} from './components/fieldlabel';
import {fieldLabelPopover} from './components/fieldlabelpopover';
import {fieldContainer} from './components/fieldcontainer';
import {fieldGenericDisplay} from './components/fieldgenericdisplay';
import {fieldText} from './components/fieldtext';
import {fieldNumber} from './components/fieldnumber';
import {fieldHtml} from './components/fieldhtml';
import {fieldHtmlEditor} from './components/fieldhtmleditor';
import {fieldWYSIWYGEditor} from './components/fieldwysiwygeditor';
import {fieldFloat} from './components/fieldfloat';
import {fieldCurrency} from './components/fieldcurrency';
import {fieldWeightedAmount} from './components/fieldweightedamount';
import {fieldTotalAmount} from './components/fieldtotalamount';
import {fieldEnum} from './components/fieldenum';
import {fieldLanguage} from './components/fieldlanguage';
import {fieldEmailTo} from './components/fieldemailto';
import {fieldEmailTemplates} from './components/fieldemailtemplates';
import {fieldTextMessageTemplates} from './components/fieldtextmessagetemplates';
import {fieldMultienum} from './components/fieldmultienum';
import {fieldGroupedEnum} from './components/fieldgroupedenum';
import {fieldMultienumCheckBox} from './components/fieldmultienumcheckbox';
import {fieldMultipleEnumDropdown} from './components/fieldmultipleenumdropdown';
import {fieldEnumAlternate} from './components/fieldenumalternate';
import {fieldEnumRadio} from './components/fieldenumradio';
import {fieldBool} from './components/fieldbool';
import {fieldBoolLabelAligned} from './components/fieldboollabelaligned';
import {fieldParent} from './components/fieldparent';
import {fieldModuleFilter} from './components/fieldmodulefilter';
import {fieldRelate} from './components/fieldrelate';
import {fieldRelateList} from './components/fieldrelatelist';
import {fieldModifiedBy} from './components/fieldmodifiedby';
import {fieldLookup} from './components/fieldlookup';
import {fieldDate} from './components/fielddate';
import {fieldTime} from './components/fieldtime';
import {fieldDateTime} from './components/fielddatetime';
import {fieldDateTimeDuration} from './components/fielddatetimeduration';
import {fieldDuration} from './components/fieldduration';
import {fieldDateTimeSpan} from './components/fielddatetimespan';
import {fieldDateSpan} from './components/fielddatespan';
import {fieldAddress} from './components/fieldaddress';
import {fieldFullName} from './components/fieldfullname';
import {fieldTitle} from './components/fieldtitle';
import {fieldFile} from './components/fieldfile';
import {fieldUrl} from './components/fieldurl';
import {fieldEmail} from './components/fieldemail';
import {fieldEmailAddresses} from './components/fieldemailaddresses';
import {fieldEmailEmailAddressStatus} from './components/fieldemailemailaddressstatus';
import {fieldEmailEmailAddress} from './components/fieldemailemailaddress';
import {fieldEmailRecipients} from './components/fieldemailrecipients';
import {fieldEmailRecipientsShort} from './components/fieldemailrecipientsshort';
import {fieldCurrencies} from './components/fieldcurrencies';
import {fieldCompanies} from './components/fieldcompanies';
import {fieldVat} from './components/fieldvat';
import {fieldBarcode} from './components/fieldbarcode';
import {fieldBarcodeRenderer} from './components/fieldbarcoderenderer';
import {fieldRating} from './components/fieldrating';
import {fieldLookupRecent} from './components/fieldlookuprecent';
import {fieldLookupRecentItem} from './components/fieldlookuprecentitem';
import {fieldLookupSearch} from './components/fieldlookupsearch';
import {fieldLookupSearchItem} from './components/fieldlookupsearchitem';
import {fieldLookupSearchAdd} from './components/fieldlookupsearchadd';
import {fieldModelFooterPopover} from './components/fieldmodelfooterpopover';
import {FieldMessagesComponent} from "./components/fieldmessages";
import {FieldModuleLookupComponent} from "./components/fieldmodulelookup";
import {FieldSignatureComponent} from "./components/fieldsignature";
import {fieldCategories} from "./components/fieldcategories";
import {fieldCategoriesTree} from "./components/fieldcategoriestree";
import {fieldServiceCategories,} from "./components/fieldservicecategories";
import {fieldServiceCategoryTree} from "./components/fieldservicecategorytree";
import {fieldServiceCategorySearch} from "./components/fieldservicecategorysearch";
import {fieldWorklog} from "./components/fieldworklog";
import {FieldModelInfoComponent} from "./components/fieldmodelinfo";
import {FieldEnumModulesComponent} from "./components/fieldenummodules";
import {fieldGDPR} from "./components/fieldgdpr";
import {fieldSelectTree,} from "./components/fieldselecttree";
import {fieldSelectTreeSearch} from "./components/fieldselecttreesearch";
import {fieldSelectTreeTree} from "./components/fieldselecttreetree";
import {fieldColorEnum} from "./components/fieldcolorenum";
import {fieldBase64} from "./components/fieldbase64";
import {fieldNotAuthorized} from "./components/fieldnotauthorized";
import {fieldModuleIcon} from "./components/fieldmoduleicon";
import {fieldRichText} from "./components/fieldrichtext";
import {fieldEnumMulti} from "./components/fieldenummulti";
import {fieldCronInterval} from "./components/fieldcroninterval";
import {fieldGooglePlacesSearch} from "./components/fieldgoogleplacessearch";
import {fieldTextID} from "./components/fieldtextid";
import {fieldBackendMethod} from "./components/fieldbackendmethod";
import {fieldSystemLabel} from "./components/fieldsystemlabel";
import {fieldTimeDifference} from "./components/fieldtimedifference";
import {fieldIconPopover} from "./components/fieldiconpopover";
import {fieldStylesheetID} from "./components/fieldstylesheetid";
import {fieldUnitsOfMeasure} from "./components/fieldunitsofmeasure";
import {fieldQuantity} from "./components/fieldquantity";
import {fieldQuestionnaireEvaluation} from './components/fieldquestionnaireevaluation';
import {fieldTags} from './components/fieldtags';
import {fieldParentDetails} from './components/fieldparentdetails';
import {fieldRelatedDetails} from './components/fieldrelateddetails';
import {fieldRelatedDetailsContainer} from './components/fieldrelateddetailscontainer';
import {fieldPhone} from "./components/fieldphone";
import {fieldActionset} from "./components/fieldactionset";
import {fieldSlider} from "./components/fieldslider";
import {fieldImage} from './components/fieldimage';
import {fieldCompound} from './components/fieldcompound';
import {fieldIconCondition} from './components/fieldiconcondition';
import {fieldIndicator} from './components/fieldindicator';
import {fieldEmailRecipientsInput} from './components/fieldemailrecipientsinput';
import {fieldJson} from "./components/fieldjson";
import {fieldLinked} from "./components/fieldlinked";
import {fieldLinkedDetails} from "./components/fieldlinkeddetails";
import {fieldLinkedParent} from "./components/fieldlinkedparent";

/**
 * @ignore
 */
declare var _: any;

/**
 * the ObjectFields module holds all components taht are relevant for rendering fields. So they are resonsible for the display and editing of information tied to the metadata of a model
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        DragDropModule,
    ],
    declarations: [
        fieldSet,
        field,
        fieldBlank,
        fieldNotAuthorized,
        fieldLabel,
        fieldLabelPopover,
        fieldContainer,
        fieldGeneric,
        fieldGenericDisplay,
        fieldText,
        fieldNumber,
        fieldHtml,
        fieldHtmlEditor,
        fieldWYSIWYGEditor,
        fieldFloat,
        fieldCurrency,
        fieldWeightedAmount,
        fieldTotalAmount,
        fieldCurrencies,
        fieldCompanies,
        fieldEnum,
        fieldLanguage,
        fieldEmailTo,
        fieldEmailTemplates,
        fieldTextMessageTemplates,
        fieldMultienum,
        fieldGroupedEnum,
        fieldMultienumCheckBox,
        fieldMultipleEnumDropdown,
        fieldEnumAlternate,
        fieldEnumRadio,
        fieldBool,
        fieldBoolLabelAligned,
        fieldDate,
        fieldTime,
        fieldDateTime,
        fieldDateTimeDuration,
        fieldDuration,
        fieldDateSpan,
        fieldDateTimeSpan,
        fieldParent,
        fieldModuleFilter,
        fieldRelate,
        fieldRelateList,
        fieldModifiedBy,
        fieldLinked,
        fieldLinkedDetails,
        fieldLinkedParent,
        fieldLookup,
        fieldLookupRecent,
        fieldLookupRecentItem,
        fieldLookupSearch,
        fieldLookupSearchItem,
        fieldLookupSearchAdd,
        fieldAddress,
        fieldModelFooterPopover,
        fieldFullName,
        fieldTitle,
        fieldFile,
        fieldUrl,
        fieldEmail,
        fieldEmailAddresses,
        fieldEmailRecipients,
        fieldEmailRecipientsShort,
        fieldEmailEmailAddress,
        fieldEmailEmailAddressStatus,
        fieldVat,
        fieldBarcode,
        fieldBarcodeRenderer,
        fieldRating,
        FieldMessagesComponent,
        FieldModuleLookupComponent,
        FieldSignatureComponent,
        fieldCategories,
        fieldCategoriesTree,
        fieldServiceCategories,
        fieldServiceCategoryTree,
        fieldServiceCategorySearch,
        fieldWorklog,
        FieldModelInfoComponent,
        FieldEnumModulesComponent,
        FieldModelInfoComponent,
        fieldGDPR,
        fieldSelectTree,
        fieldSelectTreeSearch,
        fieldSelectTreeTree,
        fieldColorEnum,
        fieldBase64,
        fieldModuleIcon,
        fieldRichText,
        fieldEnumMulti,
        fieldCronInterval,
        fieldGooglePlacesSearch,
        fieldTextID,
        fieldBackendMethod,
        fieldSystemLabel,
        fieldTimeDifference,
        fieldIconPopover,
        fieldStylesheetID,
        fieldUnitsOfMeasure,
        fieldQuantity,
        fieldQuestionnaireEvaluation,
        fieldTags,
        fieldParentDetails,
        fieldRelatedDetails,
        fieldRelatedDetailsContainer,
        fieldPhone,
        fieldActionset,
        fieldImage,
        fieldActionset,
        fieldSlider,
        fieldCompound,
        fieldIconCondition,
        fieldIndicator,
        fieldEmailRecipientsInput,
        fieldJson
    ],
    exports: [
        fieldSet,
        field,
        fieldLabel,
        fieldContainer,
        fieldGeneric,
        fieldGenericDisplay,
        fieldHtml,
        FieldMessagesComponent,
        FieldModuleLookupComponent,
        fieldNotAuthorized,
        fieldLookup,
        fieldLookupRecent,
        fieldLookupSearch,
        fieldLookupSearchAdd,
        fieldTags,
        fieldCategories,
        fieldCategoriesTree,
        fieldEmailRecipientsInput
    ]
})
export class ObjectFields {}
