import {Component, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {Subject} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {ProductGroupManagerDetailsAttributesItem} from "./productgroupmanagerdetailsattributesitem";

@Component({
    selector: 'product-group-manager-details-attributes',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributes.html',
    providers: [relatedmodels]
})
export class ProductGroupManagerDetailsAttributes {

    @ViewChild('buttoncontainer', {read: ViewContainerRef}) private buttonContainer: ViewContainerRef;
    @ViewChild('itemcontainer', {read: ViewContainerRef}) private itemContainer: ViewContainerRef;

    @ViewChildren(ProductGroupManagerDetailsAttributesItem) private attributeItems;

    public fields: any[] = [];
    public attributes: any[] = [];
    public filterKeyword: string = '';
    private allExpanded: boolean = false;

    constructor(private language: language,
                private backend: backend,
                private metadata: metadata,
                private relatedmodels: relatedmodels,
                private model: model) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = 'ProductAttributes';

        this.backend.getRequest(`productgroups/${this.model.id}/productattributes/direct`).subscribe(res => {
            this.attributes = this.sortAttributes(res) || [];
        });
    }

    get filteredAttributes() {
        return this.attributes.filter(attr => this.filterKeyword.length == 0 || attr.summary_text.toLowerCase().includes(this.filterKeyword.toLowerCase()));
    }

    get canAdd() {
        return this.model.checkAccess('edit');
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private sortAttributes(array) {
        return array.sort((a,b) => {
            let summaryTextA = a.summary_text.toUpperCase();
            let summaryTextB = b.summary_text.toUpperCase();

            if (summaryTextA < summaryTextB) {
                return -1;
            }
            if (summaryTextA > summaryTextB) {
                return 1;
            }
            return 0;
        });
    }

    private toggleCollapse() {
        this.allExpanded = !this.allExpanded;
        this.attributeItems._results.forEach(item => item.expand(this.allExpanded));
    }

    private handleAddEvent(item) {
        this.attributes = [...this.attributes, item];
        this.attributes = this.sortAttributes(this.attributes);
        this.relatedmodels.addItems([item]);
    }
}