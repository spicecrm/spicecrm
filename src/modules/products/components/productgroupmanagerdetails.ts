/**
 * @module ModuleProducts
 */
import {Component, Input, OnChanges, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'product-group-manager-details',
    templateUrl: '../templates/Productgroupmanagerdetails.html',
    providers: [model]
})
export class ProductGroupManagerDetails implements OnChanges, OnDestroy {
    @ViewChild("detailscontainer", {read: ViewContainerRef, static: true}) public detailsContainer: ViewContainerRef;

    @Input('groupid') public groupId: string;
    public renderedComponents: any[] = [];

    constructor(public language: language, public model: model, public metadata: metadata) {
        this.model.module = 'ProductGroups';
    }

    public ngOnChanges() {
        if (!this.groupId) {
            return;
        }
        this.model.id = this.groupId;
        this.model.getData(true, "", true).subscribe(() => this.buildContainer());
    }

    public ngOnDestroy() {
        this.renderedComponents.forEach(c => c.destroy());
    }

    public buildContainer() {
        this.renderedComponents.forEach(c => c.destroy());
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
