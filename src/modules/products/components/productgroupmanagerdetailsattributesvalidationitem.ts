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
    templateUrl: '../templates/productgroupmanagerdetailsattributesvalidationitem.html',
    providers: [model, view]
})
export class ProductGroupManagerDetailsAttributesValidationItem {
    @Input() public item: any;
    @Input() public listFields: any[] = [];

    constructor(public language: language,
                public backend: backend,
                public metadata: metadata,
                public view: view,
                public model: model) {
        this.view.displayLabels = false;
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

    public trackByFn(index, item) {
        return item.id;
    }
}
