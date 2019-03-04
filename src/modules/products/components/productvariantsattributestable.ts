/**
 * @module ModuleProducts
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnChanges, OnInit, EventEmitter, OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'product-variants-attributes-table',
    templateUrl: './src/modules/products/templates/productvariantsattributestable.html'
})
export class ProductVariantsAttributesTable implements OnInit, OnDestroy {

    componentSubscriptions: Array<any> = [];
    attributes: Array<any> = [];
    attributesproductid: string = '';
    loading: boolean = false;
    tableguid: string = '';
    displaygroups: Array<any> = [];
    displaygroup: string = 'all';

    @Input() showrequired: boolean = true;
    @Input() showoptional: boolean = false;
    @Input() showreadonly: boolean = false;

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private view: view) {
        this.componentSubscriptions.push(model.data$.subscribe(event => {
                this.loadAttributes();
            })
        );

        this.tableguid = this.model.generateGuid();
    }

    ngOnInit() {
        this.loadAttributes();
    }


    ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    loadAttributes() {
        if (this.model.data.product_id && this.model.data.product_id !== this.attributesproductid) {
            this.loading = true;
            this.attributesproductid = this.model.data.product_id;
            this.backend.getRequest('products/' + this.model.data.product_id + '/productattributes/direct').subscribe(attributes => {
                this.attributes = attributes;

                // get the display groups
                for (let attribute of this.attributes) {
                    if (attribute.attr_displaygrp && attribute.attr_displaygrp != '' && this.displaygroups.indexOf(attribute.attr_displaygrp) == -1) {
                        this.displaygroups.push(attribute.attr_displaygrp);
                    }
                }

                this.loading = false;
            })
        } else if (!this.model.data.product_id) {
            this.attributes = [];
        }
    }

    required(attribute) {
        return this.view.isEditMode() && attribute.attr_usage == 'required';
    }

    displayAttribute(attribute) {

        switch (attribute.attr_usage) {
            case 'none':
                return this.showreadonly;
            case 'required':
                return this.showrequired;
            default:
                return this.showoptional;
        }
    }

    get displayattributes() {
        let attributes = [];

        for (let attribute of this.attributes) {
            if (this.displayAttribute(attribute) && (this.displaygroup == 'all' || (this.displaygroup != 'all' && attribute.attr_displaygrp == this.displaygroup))) {
                attributes.push(attribute);
            }
        }

        attributes.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        })

        return attributes;
    }
}