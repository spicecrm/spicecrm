import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {productfinder} from "../services/productfinder.service";

@Component({
    selector: 'product-group-manager-details-attributes-item',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributesitem.html',
    providers: [model, relatedmodels]
})
export class ProductGroupManagerDetailsAttributesItem implements OnInit, AfterViewInit {
    public detailsItems: any[] = [];
    @ViewChild('detailscontainer', {read: ViewContainerRef}) private detailsContainer: ViewContainerRef;
    @Input() private attribute: any;
    private isOpen: boolean = false;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private router: Router,
                private relatedmodels: relatedmodels,
                private productFinder: productfinder
    ) {
    }

    get thisModel() {
        return {id: this.model.id, module: this.model.module, data: this.model.data};
    }

    get showParent() {
        return (this.attribute.parent_id != this.productFinder.searchfocus.object.id) && (this.attribute.parent_name && this.attribute.parent_name.length > 0);
    }

    get iconStyle() {
        return !this.isOpen ? {transform: 'scale(1, -1)'} : {};
    }

    public ngOnInit() {
        this.model.module = 'ProductAttributes';
        this.model.id = this.attribute.id;
        this.model.data = this.attribute;
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.loaditems = -1;
        this.relatedmodels.relatedModule = 'ProductAttributeValueValidations';
    }

    public ngAfterViewInit() {
        let componentConfig = this.metadata.getComponentConfig('ProductGroupManagerDetailsAttributesItem', 'ProductGroups');
        let components = componentConfig && componentConfig.componentset ? this.metadata.getComponentSetObjects(componentConfig.componentset) : [];
        for (let component of components) {
            this.metadata.addComponent(component.component, this.detailsContainer).subscribe(componentRef => {
                this.detailsItems.push(componentRef);
            });
        }
        this.relatedmodels.getData();
    }

    private goDetails() {
        this.router.navigate(["module/ProductAttributes/" + this.attribute.id]);
    }

    private toggleOpen() {
        this.isOpen = !this.isOpen;
    }

    // will be called from parent
    private expand(bool) {
        this.isOpen = bool;
    }
}
