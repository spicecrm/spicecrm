import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'product-group-manager-details',
    templateUrl: './src/modules/products/templates/Productgroupmanagerdetails.html',
    providers: [model]
})
export class ProductGroupManagerDetails {
    @ViewChild("detailscontainer", {read: ViewContainerRef}) private detailsContainer: ViewContainerRef;

    @Input('groupid') private groupId: string;
    private renderedComponents: any[] = [];

    constructor(private language: language, private model: model, private metadata: metadata) {
    }

    ngOnChanges() {
        if (!this.groupId) {return}
        this.model.id = this.groupId;
        this.model.getData(true, "", true);
        if (this.renderedComponents.length == 0) {
            this.buildContainer();
        }
    }

    private buildContainer() {
        let componentconfig = this.metadata.getComponentConfig("ProductGroupManagerDetails", this.model.module);
        let componentSet = componentconfig.componentset;

        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.detailsContainer).subscribe(componentref => {
                    this.renderedComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }
}
