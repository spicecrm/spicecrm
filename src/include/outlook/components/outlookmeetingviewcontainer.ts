/**
 * @module Outlook
 */

import {Component, Input, OnInit} from "@angular/core";

import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'outlook-meeting-view-container',
    templateUrl: './src/include/outlook/templates/outlookmeetingviewcontainer.html',
    providers: [model, view]
})
export class OutlookMeetingViewContainer implements OnInit {

    /**
     * the custom properties of the object
     */
    @Input() private customProperties: any;

    /**
     * the module of the item
     */
    @Input() private module: string;

    /**
     * the id of the item
     */
    @Input() private id: string;

    /**
     * the componentset
     */
    private componentset: string;

    constructor(
        private metadata: metadata,
        private view: view,
        private model: model
    ) {
    }

    public ngOnInit(): void {

        // load the config
        this.getConfiguration();

        // load the model
        this.loadModel();
    }

    private getConfiguration() {
        let componentconfig = this.metadata.getComponentConfig('OutlookMeetingViewContainer', this.module);
        this.componentset = componentconfig.componentset;
    }


    /**
     * initialöizes and oads the model
     */
    private loadModel() {
        this.model.module = this.module;
        this.model.id = this.id;
        this.model.getData();
    }

}
