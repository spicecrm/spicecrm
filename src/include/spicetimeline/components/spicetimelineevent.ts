/**
 * @module ModuleSpiceTimeline
 */
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'spice-timeline-event',
    templateUrl: '../templates/spicetimelineevent.html',
    providers: [model]
})
export class SpiceTimelineEvent implements OnChanges, OnInit {
    /**
     * holds the records main module
     */
    @Input() public event: any;
    /**
     * a fieldset id for loading a body fieldset in the event
     */
    public fieldset: string;

    constructor(public metadata: metadata,
                public model: model) {
    }

    /**
     * call to set the model data
     */
    public ngOnInit() {
        this.loadFieldset();
    }

    /**
     * call to set the model data
     */
    public ngOnChanges() {
        this.setModelData();
    }

    /**
     * load event fieldsets
     */
    public loadFieldset() {
        let config = this.metadata.getComponentConfig('SpiceTimelineEvent', this.model.module);
        if (config && config.fieldset) {
            this.fieldset = config.fieldset;
        }
    }

    /**
     * set model data from event
     */
    public setModelData() {
        this.model.id = this.event.id;
        this.model.module = this.event.module;
        this.model.setData(this.event.data);
    }
}



