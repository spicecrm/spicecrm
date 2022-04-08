/**
 * @module ModuleProducts
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';
import {metadata} from "../../../services/metadata.service";


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-brwoser-variant',
    templateUrl: '../templates/productbrowservariant.html',
    providers: [model]
})
export class ProductBrowserVariant implements OnInit {

    @Input() public productvariant: any = {};
    @Output() public selectionchanged: EventEmitter<any> = new EventEmitter<any>();
    public opened: boolean = false;
    public fieldset: string;
    public detailsFieldset: string;

    constructor(public model: model,
                public modelutilities: modelutilities,
                public language: language,
                public metadata: metadata,
                public productfinder: productfinder) {
    }

    get buttonIcon() {
        return this.opened ? 'chevronup' : 'chevrondown';
    }

    get groupAttributes() {
        return this.productfinder.groupAttributes;
    }

    public ngOnInit() {
        this.model.id = this.productvariant.id;
        this.model.module = 'ProductVariants';
        this.model.setData(this.productvariant);

        const config = this.metadata.getComponentConfig('ProductBrowserVariant', 'ProductVariants');
        this.fieldset = !!config && !!config.fieldset ? config.fieldset : undefined;
        this.detailsFieldset = !!config && !!config.detailsFieldset ? config.detailsFieldset : undefined;

    }

    public toggleOpen() {
        this.opened = !this.opened;
    }

    public godetail() {
        this.selectionchanged.emit({
            type: 'ProductVariant',
            object: this.model
        });
    }

    public edit() {
        this.model.edit(true);
    }
}
