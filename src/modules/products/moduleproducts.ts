/**
 * @module ModuleProducts
 */
import {CommonModule} from '@angular/common';
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, Renderer2, ViewChild, ViewContainerRef, Injectable, Input, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule}   from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {DirectivesModule} from "../../directives/directives";

import {Subject, Observable, Subscription} from 'rxjs';


import {loginService, loginCheck} from '../../services/login.service';
import {metadata, aclCheck} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modelutilities} from '../../services/modelutilities.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {session} from '../../services/session.service';
import {footer} from '../../services/footer.service';
import {assistant} from '../../services/assistant.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {toast} from '../../services/toast.service';
import {fts} from '../../services/fts.service';
import {configurationService} from '../../services/configuration.service';
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import /*embed*/ { productfinder } from './services/productfinder.service';

import /*embed*/ {ProductManager} from './components/productmanager';
import /*embed*/ {ProductBrowser} from './components/productbrowser';
import /*embed*/ {ProductGroupManager} from "./components/productgroupmanager";
import /*embed*/ {ProductGroupManagerDetails} from "./components/productgroupmanagerdetails";
import /*embed*/ {ProductBrowserTree} from './components/productbrowsertree';
import /*embed*/ {ProductGroupManagerTree} from './components/productgroupmanagertree';
import /*embed*/ {ProductBrowserVariants} from './components/productbrowservariants';
import /*embed*/ {ProductBrowserVariant} from './components/productbrowservariant';
import /*embed*/ {ProductBrowserAttributes} from './components/productbrowserattributes';
import /*embed*/ {ProductVariantsAttributesTable} from './components/productvariantsattributestable';
import /*embed*/ {ProductBrowserAttributeVCSearch} from './components/productbrowserattributevcsearch';
import /*embed*/ {ProductBrowserAttributeDISearch} from './components/productbrowserattributedisearch';
import /*embed*/ {ProductBrowserAttributeNSearch} from './components/productbrowserattributensearch';
import /*embed*/ {ProductBrowserAttributeFSearch} from './components/productbrowserattributefsearch';
import /*embed*/ {ProductBrowserAttributeSSearch} from './components/productbrowserattributessearch';
import /*embed*/ {ProductVariantsAttributes} from './components/productvariantsattributes';
import /*embed*/ {ProductVariantsAttributeVC} from './components/productvariantsattributevc';
import /*embed*/ {ProductVariantsAttributeDI} from './components/productvariantsattributedi';
import /*embed*/ {ProductVariantsAttributeN} from './components/productvariantsattributen';
import /*embed*/ {ProductVariantsAttributeF} from './components/productvariantsattributef';
import /*embed*/ {ProductVariantsAttributeSS} from "./components/productvariantsattributess";
import /*embed*/ {ProductTextGenerator} from './components/producttextgenerator';
import /*embed*/ {ProductGroupsContentCodeAssignments} from './components/productgroupscontentcodeassignments';
import /*embed*/ {ProductGroupsLongtextCodeAssignments} from './components/productgroupslongtextcodeassignments';
import /*embed*/ {ProductGroupManagerDetailsAttributesValidationItem} from "./components/productgroupmanagerdetailsattributesvalidationitem";
import /*embed*/ {ProductGroupManagerDetailsAttributesValidation} from "./components/productgroupmanagerdetailsattributesvalidation";
import /*embed*/ {ProductGroupManagerDetailsAttributesItem} from "./components/productgroupmanagerdetailsattributesitem";
import /*embed*/ {ProductGroupManagerDetailsAttributesAddButton} from "./components/productgroupmanagerdetailsattributesaddbutton";
import /*embed*/ {ProductGroupManagerDetailsAttributes} from './components/productgroupmanagerdetailsattributes';
import /*embed*/ {ProductUOMConversions} from "./components/productuomconversions";

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
        ProductTextGenerator,
        ProductGroupsContentCodeAssignments,
        ProductGroupsLongtextCodeAssignments,
        ProductUOMConversions,
    ]
})
export class ModuleProducts {
    public readonly version = '1.0';
    public readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
