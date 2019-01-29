import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";

@Component({
    selector: 'product-group-manager-details-attributes-item',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributesitem.html',
    providers: [model]
})
export class ProductGroupManagerDetailsAttributesItem {
    @ViewChild('detailscontainer', {read: ViewContainerRef}) private detailsContainer: ViewContainerRef;

    @Input() private attribute: any;
    public detailsItems: any[] = [];
    private isOpen: boolean = false;

    constructor(private language: language, private model: model, private metadata: metadata, private router: Router) {
    }

    public ngOnInit() {
        this.model.module = 'ProductAttributes';
        this.model.id = this.attribute.id;
        this.model.data = this.attribute;
    }

    public ngAfterViewInit() {
        let compConfig = this.metadata.getComponentConfig('ProductGroupManagerDetailsAttributesItem', 'ProductGroups');
        let components = this.metadata.getComponentSetObjects(compConfig.componentset);
        for (let component of components) {
            this.metadata.addComponent(component.component, this.detailsContainer).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = component.componentconfig;
                this.detailsItems.push(componentRef);
            });
        }
    }

    private goDetails() {
        this.router.navigate(["module/ProductAttributes/" + this.attribute.id]);
    }

    private toggleOpen() {
        this.isOpen = !this.isOpen;
    }

    get iconStyle() {
        return !this.isOpen ? {transform: 'scale(1, -1)'} : {};
    }
}
