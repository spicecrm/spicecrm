/**
 * @module ServiceComponentsModule
 */
import {Component, OnInit} from '@angular/core';
import {ObjectModelPopover} from "../../../objectcomponents/components/objectmodelpopover";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";

/**
 * extends an object model popover and load the configs for this component
 */
@Component({
    selector: 'service-planner-maps-model-popover',
    templateUrl: '../../../objectcomponents/templates/objectmodelpopover.html',
    providers: [view]
})
export class ServicePlannerMapsModelPopover extends ObjectModelPopover implements OnInit {

    constructor(
        public model: model,
        public view: view,
        public metadata: metadata) {
        super(model, view, metadata);
    }

    /**
     * initialize the model data and calculate the route
     */
    public ngOnInit() {

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('ServicePlannerMapsModelPopover', this.model.module);
        if (componentconfig.fieldset || componentconfig.componentset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);

            this.fieldset = componentconfig.fieldset;
            this.componentset = componentconfig.componentset;
            this.headercomponentset = componentconfig.headercomponentset;
        }

        // if we did not find a fieldset try to take the header one instead
        if (!this.fieldset) {
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.model.module);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
                this.fieldset = componentconfig.fieldset;
            }
        }

        this.styles = this.popoverStyle;
    }
}
