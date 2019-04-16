import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'product-group-manager-details-attributes-add-button',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributesaddbutton.html',
    providers: [model]

})
export class ProductGroupManagerDetailsAttributesAddButton {
    @Output() private changes: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private backend: backend, private metadata: metadata, private model: model) {
        this.model.module = 'ProductAttributes';
    }

    private addItem() {
        this.model.id = '';
        this.model.addModel().subscribe(res => {
            if (typeof res == 'object') {
                this.changes.emit(res);
            }
        });
    }
}
