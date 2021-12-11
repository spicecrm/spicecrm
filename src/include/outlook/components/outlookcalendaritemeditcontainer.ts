/**
 * @module Outlook
 */

import {Component, Input, OnInit} from "@angular/core";

import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'outlook-calendaritem-edit-container',
    templateUrl: '../templates/outlookcalendaritemeditcontainer.html',
    providers: [model, view]
})
export class OutlookCalendarItemEditContainer implements OnInit {

    /**
     * the custom properties of the object
     */
    @Input() public customProperties: any;

    /**
     * the module of the item
     */
    @Input() public module: string;

    /**
     * the id of the item
     */
    @Input() public id: string;

    /**
     * the componentset
     */
    public componentset: string;

    constructor(
        public metadata: metadata,
        public view: view,
        public model: model
    ) {
    }

    public ngOnInit(): void {

        // load the config
        this.getConfiguration();

        // load the model
        this.loadModel();
    }

    public getConfiguration() {
        let componentconfig = this.metadata.getComponentConfig('OutlookCalendarItemEditContainer', this.module);
        this.componentset = componentconfig.componentset;
    }


    /**
     * initialöizes and oads the model
     */
    public loadModel() {
        this.model.module = this.module;
        this.model.id = this.id;
        this.model.getData();
    }

}
