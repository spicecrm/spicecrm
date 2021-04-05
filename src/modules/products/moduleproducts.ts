/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
export class ModuleProducts {}
