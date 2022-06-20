/**
 * @module ModuleProducts
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {FormsModule}   from '@angular/forms';

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import {ProductManager} from './components/productmanager';
import {ProductBrowser} from './components/productbrowser';
import {ProductGroupManager} from "./components/productgroupmanager";
import {ProductGroupManagerDetails} from "./components/productgroupmanagerdetails";
import {ProductBrowserTree} from './components/productbrowsertree';
import {ProductGroupManagerTree} from './components/productgroupmanagertree';
import {ProductBrowserVariants} from './components/productbrowservariants';
import {ProductBrowserVariant} from './components/productbrowservariant';
import {ProductBrowserAttributes} from './components/productbrowserattributes';
import {ProductVariantsAttributesTable} from './components/productvariantsattributestable';
import {ProductBrowserAttributeVCSearch} from './components/productbrowserattributevcsearch';
import {ProductBrowserAttributeDISearch} from './components/productbrowserattributedisearch';
import {ProductBrowserAttributeNSearch} from './components/productbrowserattributensearch';
import {ProductBrowserAttributeFSearch} from './components/productbrowserattributefsearch';
import {ProductBrowserAttributeSSearch} from './components/productbrowserattributessearch';
import {ProductVariantsAttributes} from './components/productvariantsattributes';
import {ProductVariantsAttributeVC} from './components/productvariantsattributevc';
import {ProductVariantsAttributeDI} from './components/productvariantsattributedi';
import {ProductVariantsAttributeN} from './components/productvariantsattributen';
import {ProductVariantsAttributeF} from './components/productvariantsattributef';
import {ProductVariantsAttributeSS} from "./components/productvariantsattributess";
import {ProductGroupsContentCodeAssignments} from './components/productgroupscontentcodeassignments';
import {ProductGroupsLongtextCodeAssignments} from './components/productgroupslongtextcodeassignments';
import {ProductGroupManagerDetailsAttributesValidationItem} from "./components/productgroupmanagerdetailsattributesvalidationitem";
import {ProductGroupManagerDetailsAttributesValidation} from "./components/productgroupmanagerdetailsattributesvalidation";
import {ProductGroupManagerDetailsAttributesItem} from "./components/productgroupmanagerdetailsattributesitem";
import {ProductGroupManagerDetailsAttributesAddButton} from "./components/productgroupmanagerdetailsattributesaddbutton";
import {ProductGroupManagerDetailsAttributes} from './components/productgroupmanagerdetailsattributes';
import {ProductUOMConversions} from "./components/productuomconversions";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        ProductManager,
        ProductGroupManager,
        ProductGroupManagerDetails,
        ProductGroupManagerDetailsAttributesValidationItem,
        ProductGroupManagerDetailsAttributesValidation,
        ProductGroupManagerDetailsAttributesAddButton,
        ProductGroupManagerDetailsAttributesItem,
        ProductGroupManagerDetailsAttributes,
        ProductBrowser,
        ProductBrowserTree,
        ProductGroupManagerTree,
        ProductBrowserVariants,
        ProductBrowserVariant,
        ProductBrowserAttributes,
        ProductBrowserAttributeVCSearch,
        ProductBrowserAttributeDISearch,
        ProductBrowserAttributeNSearch,
        ProductBrowserAttributeFSearch,
        ProductBrowserAttributeSSearch,
        ProductVariantsAttributeVC,
        ProductVariantsAttributeDI,
        ProductVariantsAttributeN,
        ProductVariantsAttributeF,
        ProductVariantsAttributeSS,
        ProductVariantsAttributesTable,
        ProductVariantsAttributes,
        ProductGroupsContentCodeAssignments,
        ProductGroupsLongtextCodeAssignments,
        ProductUOMConversions,
    ]
})
export class ModuleProducts {}
