/**
 * @module ModuleSAPIDOCs
 */
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI, sapIDOCSegmentRelationI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanageridoctypeaddmodal.html'
})
export class SAPIDOCsManagerIDOCTypeAddModal implements OnInit {

    private self: any;

    private segmentRelation: sapIDOCSegmentRelationI;
    private segment: sapIDOCSegmentI;

    @Input() private idoctyp: string = '';
    @Input() private mestyp: string = '';

    constructor(private sapIdocsManager: sapIdocsManager, private helper: helper) {

    }

    public ngOnInit(): void {
        this.initializeType();
    }

    /**
     * initializes the segment
     */
    private initializeType() {
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
    private close() {
        this.self.destroy();
    }

    /**
     * adds the segment and closes the modal
     */
    private add() {
        this.sapIdocsManager.addIdocType(this.segmentRelation, this.segment);
        this.close();
    }

}

