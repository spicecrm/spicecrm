/**
 * @module ModuleProducts
 */
import {Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {broadcast} from "../../../services/broadcast.service";
import {productfinder} from "../services/productfinder.service";

@Component({
    selector: 'product-group-manager-details-attributes',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributes.html',
    providers: [relatedmodels]
})
export class ProductGroupManagerDetailsAttributes implements OnInit, OnDestroy {

    public fields: any[] = [];
    public attributes: any[] = [];
    public filterKeyword: string = '';
    @ViewChild('buttoncontainer', {read: ViewContainerRef, static: true}) private buttonContainer: ViewContainerRef;
    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) private itemContainer: ViewContainerRef;
    private allExpanded: boolean = false;
    private isLoading: boolean = true;
    private modelSubscription: Subscription = new Subscription();

    constructor(private language: language,
                private backend: backend,
                private metadata: metadata,
                private productFinder: productfinder,
                private broadcast: broadcast,
                private relatedmodels: relatedmodels,
                private model: model) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = 'ProductAttributes';
        this.saveSubscriber();
    }

    get filteredAttributes() {
        return this.attributes.filter(attr => this.filterKeyword.length == 0 || attr.summary_text.toLowerCase().includes(this.filterKeyword.toLowerCase()));
    }

    get canAdd() {
        return this.metadata.checkModuleAcl(this.model.module, "create");
    }

    public ngOnInit() {
        this.backend.getRequest(`module/ProductGroups/${this.model.id}/ProductAttributes/direct`).subscribe(res => {
            this.attributes = this.sortAttributes(res) || [];
            this.isLoading = false;
        }, err => this.isLoading = false);
    }

    public ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private sortAttributes(array) {
        return array.sort((a, b) => {
            return +a.sort_sequence > +b.sort_sequence ? 1 : -1;
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

    private handleAddEvent(item) {
        item.parent_name = this.productFinder.searchfocus.object.id != this.model.id ? this.model.data.summary_text : '';
        item.parent_id = this.model.id;
        this.attributes = [...this.attributes, item];
        this.attributes = this.sortAttributes(this.attributes);
        this.relatedmodels.addItems([item]);
    }
}
