import {Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {Subject, Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {ProductGroupManagerDetailsAttributesItem} from "./productgroupmanagerdetailsattributesitem";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: 'product-group-manager-details-attributes',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributes.html',
    providers: [relatedmodels]
})
export class ProductGroupManagerDetailsAttributes implements OnInit, OnDestroy {

    @ViewChild('buttoncontainer', {read: ViewContainerRef}) private buttonContainer: ViewContainerRef;
    @ViewChild('itemcontainer', {read: ViewContainerRef}) private itemContainer: ViewContainerRef;

    @ViewChildren(ProductGroupManagerDetailsAttributesItem) private attributeItems;

    public fields: any[] = [];
    public attributes: any[] = [];
    public filterKeyword: string = '';
    private allExpanded: boolean = false;
    private isLoading: boolean = true;
    private modelSubscription: Subscription = new Subscription();

    constructor(private language: language,
                private backend: backend,
                private metadata: metadata,
                private broadcast: broadcast,
                private relatedmodels: relatedmodels,
                private model: model) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = 'ProductAttributes';
        this.saveSubscriber();
    }

    public ngOnInit() {
        this.backend.getRequest(`productgroups/${this.model.id}/productattributes/direct`).subscribe(res => {
            this.attributes = this.sortAttributes(res) || [];
            this.isLoading = false;
        }, err => this.isLoading = false);
    }

    get filteredAttributes() {
        return this.attributes.filter(attr => this.filterKeyword.length == 0 || attr.summary_text.toLowerCase().includes(this.filterKeyword.toLowerCase()));
    }

    get canAdd() {
        return this.metadata.checkModuleAcl(this.model.module, "create");
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private sortAttributes(array) {
        return array.sort((a,b) => {
            return a.sort_sequence > b.sort_sequence ? 1 : -1;
        });
    }

    private saveSubscriber() {
        this.modelSubscription = this.broadcast.message$.subscribe(msg => {
            let resData = msg.messagedata;
            if (resData.module == 'ProductAttributes' && msg.messagetype == 'model.save') {
                this.attributes.some((attr, i) => attr.id == resData.id ? this.attributes[i] = resData.data : false);
                this.attributes = this.sortAttributes(this.attributes);
            }
        });
    }

    private toggleCollapse() {
        this.allExpanded = !this.allExpanded;
        this.attributeItems._results.forEach(item => item.expand(this.allExpanded));
    }

    private handleAddEvent(item) {
        item.parent_name = this.model.data.summary_text;
        this.attributes = [...this.attributes, item];
        this.attributes = this.sortAttributes(this.attributes);
        this.relatedmodels.addItems([item]);
    }

    public ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }
}
