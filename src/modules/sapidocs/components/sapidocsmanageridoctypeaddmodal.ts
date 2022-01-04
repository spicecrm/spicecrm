/**
 * @module ModuleSAPIDOCs
 */
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI, sapIDOCSegmentRelationI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    templateUrl: '../templates/sapidocsmanageridoctypeaddmodal.html'
})
export class SAPIDOCsManagerIDOCTypeAddModal implements OnInit {

    public self: any;

    public segmentRelation: sapIDOCSegmentRelationI;
    public segment: sapIDOCSegmentI;

    @Input() public idoctyp: string = '';
    @Input() public mestyp: string = '';

    constructor(public sapIdocsManager: sapIdocsManager, public helper: helper) {

    }

    public ngOnInit(): void {
        this.initializeType();
    }

    /**
     * initializes the segment
     */
    public initializeType() {
        let segmentId = this.helper.generateGuid();
        this.segmentRelation = {
            id: this.helper.generateGuid(),
            deleted: '0',
            segment_id: segmentId,
            required_export: '0',
            idoctyp: '',
            mestyp: '',
            parent_segment_id: undefined,
        };

        this.segment = {
            id: segmentId,
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
        this.sapIdocsManager.addIdocType(this.segmentRelation, this.segment);
        this.close();
    }

}

