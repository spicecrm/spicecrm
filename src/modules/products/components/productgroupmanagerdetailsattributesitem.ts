/**
 * @module ModuleProducts
 */
import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {productfinder} from "../services/productfinder.service";

@Component({
    selector: 'product-group-manager-details-attributes-item',
    templateUrl: '../templates/productgroupmanagerdetailsattributesitem.html',
    providers: [model, relatedmodels]
})
export class ProductGroupManagerDetailsAttributesItem implements OnInit, AfterViewInit {
    public detailsItems: any[] = [];
    @ViewChild('detailscontainer', {read: ViewContainerRef, static: true}) public detailsContainer: ViewContainerRef;
    @Input() public attribute: any;
    public isOpen: boolean = false;

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public router: Router,
                public relatedmodels: relatedmodels,
                public productFinder: productfinder
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
        this.model.setData(this.attribute);
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
    }

    public goDetails() {
        this.router.navigate(["module/ProductAttributes/" + this.attribute.id]);
    }

    public toggleOpen(event: MouseEvent) {
        this.isOpen = !this.isOpen;
        if (this.isOpen) this.relatedmodels.getData();
        event.stopPropagation();
    }
}
