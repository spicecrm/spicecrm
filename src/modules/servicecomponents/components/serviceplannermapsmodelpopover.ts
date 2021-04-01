/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/objectcomponents/templates/objectmodelpopover.html',
    providers: [model, view]
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
        // load the model
        this.model.module = this.popovermodule;
        this.model.id = this.popoverid;
        this.model.getData();

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('ServicePlannerMapsModelPopover', this.popovermodule);
        if (componentconfig.fieldset || componentconfig.componentset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);

            this.fieldset = componentconfig.fieldset;
            this.componentset = componentconfig.componentset;
            this.headercomponentset = componentconfig.headercomponentset;
        }

        // if we did not find a fieldset try to take the header one instead
        if (!this.fieldset) {
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.popovermodule);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
                this.fieldset = componentconfig.fieldset;
            }
        }

        this.styles = this.popoverStyle;
    }
}
