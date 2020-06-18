/**
 * @module ModuleSpiceTimeline
 */
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'spice-timeline-event',
    templateUrl: './src/include/spicetimeline/templates/spicetimelineevent.html',
    providers: [model]
})
export class SpiceTimelineEvent implements OnChanges, OnInit {
    /**
     * holds the records main module
     */
    @Input() protected event: any;
    /**
     * a fieldset id for loading a body fieldset in the event
     */
    private fieldset: string;

    constructor(private metadata: metadata,
                private model: model) {
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
    private loadFieldset() {
        let config = this.metadata.getComponentConfig('SpiceTimelineEvent', this.model.module);
        if (config && config.fieldset) {
            this.fieldset = config.fieldset;
        }
    }

    /**
     * set model data from event
     */
    private setModelData() {
        this.model.id = this.event.id;
        this.model.module = this.event.module;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.event.data);
    }
}



