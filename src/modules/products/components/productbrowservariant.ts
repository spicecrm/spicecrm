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
    templateUrl: './src/modules/products/templates/productbrowservariant.html',
    providers: [model]
})
export class ProductBrowserVariant implements OnInit {

    @Input() private productvariant: any = {};
    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();
    private opened: boolean = false;
    private fieldset: string;
    private detailsFieldset: string;

    constructor(private model: model,
                private modelutilities: modelutilities,
                private language: language,
                private metadata: metadata,
                private productfinder: productfinder) {
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
        this.model.data = this.modelutilities.backendModel2spice('ProductVariants', this.productvariant);

        const config = this.metadata.getComponentConfig('ProductBrowserVariant', 'ProductVariants');
        this.fieldset = !!config && !!config.fieldset ? config.fieldset : undefined;
        this.detailsFieldset = !!config && !!config.detailsFieldset ? config.detailsFieldset : undefined;

    }

    private toggleOpen() {
        this.opened = !this.opened;
    }

    private godetail() {
        this.selectionchanged.emit({
            type: 'ProductVariant',
            object: this.model
        });
    }

    private edit() {
        this.model.edit(true);
    }
}
