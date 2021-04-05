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
import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {productfinder} from "../services/productfinder.service";

@Component({
    selector: 'product-group-manager-details-attributes-item',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributesitem.html',
    providers: [model, relatedmodels]
})
export class ProductGroupManagerDetailsAttributesItem implements OnInit, AfterViewInit {
    public detailsItems: any[] = [];
    @ViewChild('detailscontainer', {read: ViewContainerRef, static: true}) private detailsContainer: ViewContainerRef;
    @Input() private attribute: any;
    private isOpen: boolean = false;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private router: Router,
                private relatedmodels: relatedmodels,
                private productFinder: productfinder
    ) {
    }

    get thisModel() {
        return {id: this.model.id, module: this.model.module, data: this.model.data};
    }

    get showParent() {
        return (this.attribute.parent_id != this.productFinder.searchfocus.object.id) && (this.attribute.parent_name && this.attribute.parent_name.length > 0);
    }

    get iconStyle() {
        return !this.isOpen ? {transform: 'scale(1, -1)'} : {};
    }

    public ngOnInit() {
        this.model.module = 'ProductAttributes';
        this.model.id = this.attribute.id;
        this.model.data = this.attribute;
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.loaditems = -1;
        this.relatedmodels.relatedModule = 'ProductAttributeValueValidations';
    }

    public ngAfterViewInit() {
        let componentConfig = this.metadata.getComponentConfig('ProductGroupManagerDetailsAttributesItem', 'ProductGroups');
        let components = componentConfig && componentConfig.componentset ? this.metadata.getComponentSetObjects(componentConfig.componentset) : [];
        for (let component of components) {
            this.metadata.addComponent(component.component, this.detailsContainer).subscribe(componentRef => {
                this.detailsItems.push(componentRef);
            });
        }
    }

    private goDetails() {
        this.router.navigate(["module/ProductAttributes/" + this.attribute.id]);
    }

    private toggleOpen(event: MouseEvent) {
        this.isOpen = !this.isOpen;
        if (this.isOpen) this.relatedmodels.getData();
        event.stopPropagation();
    }
}
