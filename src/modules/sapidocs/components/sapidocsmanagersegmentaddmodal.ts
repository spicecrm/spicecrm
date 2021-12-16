/**
 * @module ModuleSAPIDOCs
 */
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    templateUrl: '../templates/sapidocsmanagersegmentaddmodal.html'
})
export class SAPIDOCsManagerSegmentAddModal implements OnInit {

    public self: any;

    public parentsegment_id: string;

    public segment: sapIDOCSegmentI;

    public added: EventEmitter<string> = new EventEmitter<string>();

    constructor(public sapIdocsManager: sapIdocsManager, public helper: helper) {

    }

    public ngOnInit(): void {
        this.initializeSegment();
    }

    /**
     * initializes the segment
     */
    public initializeSegment() {
        this.segment = {
            id: this.helper.generateGuid(),
            deleted: '0',
            active: '1',
            sap_segment: ''
        };
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * adds the segment and closes the modal
     */
    public add() {
        this.sapIdocsManager.addSegment(this.parentsegment_id, this.segment);
        this.added.emit(this.segment.id);
        this.close();
    }

}

