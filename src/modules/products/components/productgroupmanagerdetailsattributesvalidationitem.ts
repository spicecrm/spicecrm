/**
 * @module ModuleProducts
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: '[product-group-manager-details-attributes-validation-item]',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributesvalidationitem.html',
    providers: [model, view]
})
export class ProductGroupManagerDetailsAttributesValidationItem {
    @Input() private item: any;
    @Input() private listFields: any[] = [];

    constructor(private language: language,
                private backend: backend,
                private metadata: metadata,
                private view: view,
                private model: model) {
    }

    get canEdit() {
        return this.model.checkAccess('edit');
    }

    public ngOnInit() {
        this.view.isEditable = this.canEdit;
        this.model.module = 'ProductAttributeValueValidations';
        this.model.id = this.item.id;
        this.model.data = this.item;
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
