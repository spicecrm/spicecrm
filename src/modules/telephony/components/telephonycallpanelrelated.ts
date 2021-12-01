/**
 * @module ModuleTelephony
 */
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';

import {model} from "../../../services/model.service";
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';

declare var _: any;
declare var libphonenumber: any;

@Component({
    selector: 'telephony-call-panel-related',
    templateUrl: '../templates/telephonycallpanelrelated.html',
    providers: [view]
})
export class TelephonyCallPanelRelated implements OnInit {

    /**
     * the main Fieldset
     */
    public mainfieldset: string;

    /**
     * the sub fieldset
     */
    public subfieldset: string;

    constructor(public model: model, public view: view, public metadata: metadata) {
        // no labels
        this.view.displayLabels = false;
    }

    public ngOnInit(): void {
        // load the config
        this.loadconfig();
    }

    /**
     * load the config and fieldsets
     */
    public loadconfig() {
        let config = this.metadata.getComponentConfig('TelephonyCallPanelRelated', this.model.module);
        this.mainfieldset = config.mainfieldset;
        this.subfieldset = config.subfieldset;
    }

}
