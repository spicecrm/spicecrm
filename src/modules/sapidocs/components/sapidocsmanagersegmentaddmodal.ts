/**
 * @module ModuleSAPIDOCs
 */
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentaddmodal.html'
})
export class SAPIDOCsManagerSegmentAddModal implements OnInit {

    private self: any;

    private parentsegment_id: string;

    private segment: sapIDOCSegmentI;

    private added: EventEmitter<string> = new EventEmitter<string>();

    constructor(private sapIdocsManager: sapIdocsManager, private helper: helper) {

    }

    public ngOnInit(): void {
        this.initializeSegment();
    }

    /**
     * initializes the segment
     */
    private initializeSegment() {
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
    private close() {
        this.self.destroy();
    }

    /**
     * adds the segment and closes the modal
     */
    private add() {
        this.sapIdocsManager.addSegment(this.parentsegment_id, this.segment);
        this.added.emit(this.segment.id);
        this.close();
    }

}

