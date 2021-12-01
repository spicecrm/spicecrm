/**
 * @module ModuleProducts
 */
import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'product-variants-attributes-table',
    templateUrl: '../templates/productvariantsattributestable.html'
})
export class ProductVariantsAttributesTable implements OnChanges {

    @Input() public attributes: any[] = [];
    public displaygroups: any[] = [];
    public displaygroup: string = 'all';
    public showrequired: boolean = true;
    public showoptional: boolean = true;
    public showreadonly: boolean = true;

    constructor(public language: language, public elementRef: ElementRef, public view: view) {
    }

    get displayAttributes() {
        return this.attributes
            .filter(attr => this.displayAttribute(attr) && (this.displaygroup == 'all' || (this.displaygroup != 'all' && attr.attr_usagegrp == this.displaygroup)))
            .sort((a, b) => {
                return +a.sort_sequence > +b.sort_sequence ? 1 : -1;
            });
    }

    public ngOnChanges() {
        this.setDisplayGroups();
    }

    public setDisplayGroups() {
        this.displaygroups = [];
        if (!this.attributes) return;
        this.attributes.forEach(attr => {
            if (attr.attr_usagegrp && attr.attr_usagegrp != '' && this.displaygroups.indexOf(attr.attr_usagegrp) == -1) {
                this.displaygroups.push(attr.attr_usagegrp);
            }
        });
    }

    public required(attribute) {
        return this.view.isEditMode() && attribute.attr_usage == 'required';
    }

    public displayAttribute(attribute) {

        switch (attribute.attr_usage) {
            case 'none':
                return this.showreadonly;
            case 'required':
                return this.showrequired;
            default:
                return this.showoptional;
        }
    }
}
