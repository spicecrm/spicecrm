import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'product-group-manager-details-attributes',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributes.html',
})
export class ProductGroupManagerDetailsAttributes {
    public fields: any[] = [];
    public attributes: any[] = [];

    constructor(private language: language, private backend: backend, private metadata: metadata, private model: model) {
        this.backend.getRequest(`productgroups/${this.model.id}/productattributes`).subscribe(res => {
            this.attributes = res || [];
        });
    }
}