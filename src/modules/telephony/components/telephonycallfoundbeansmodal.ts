/**
 * @module ModuleTelephony
 */
import {Component, ComponentRef, EventEmitter, Output} from '@angular/core';

import {metadata} from "../../../services/metadata.service";
import {fts} from "../../../services/fts.service";
import {configurationService} from "../../../services/configuration.service";
import {Subject} from "rxjs";

/**
 * renders a modal to search for any phone related beans
 */
@Component({
    selector: 'telephony-call-found-beans-modal',
    templateUrl: '../templates/telephonycallfoundbeansmodal.html'
})
export class TelephonyCallFoundBeansModal {
    /**
     * holds the found beans passed by the parent
     */
    public foundBeans: any[] = [];
    /**
     * the reference to the modal itself
     * @private
     */
    public self: ComponentRef<TelephonyCallFoundBeansModal>;
    /**
     * an event emitter when a record is selected
     *
     * @private
     */
    @Output() public selected: Subject<any> = new Subject<any>();

    constructor(
        public metadata: metadata,
        public fts: fts,
        public configuration: configurationService
    ) {

    }

    /**
     * emit selected
     * @param selected
     * @param model
     */
    public select(selected, model) {
        this.selected.next(model);
        this.selected.complete();
        this.close();
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}
