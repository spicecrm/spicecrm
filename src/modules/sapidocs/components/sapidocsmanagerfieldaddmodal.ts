/**
 * @module ModuleSAPIDOCs
 */
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCFieldI, sapIDOCSegmentI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    templateUrl: '../templates/sapidocsmanagerfieldaddmodal.html'
})
export class SAPIDOCsManagerFieldAddModal implements OnInit {

    public self: any;

    public parentsegment_id: string;

    public field: sapIDOCFieldI;

    public added: EventEmitter<sapIDOCFieldI> = new EventEmitter<sapIDOCFieldI>();

    constructor(public sapIdocsManager: sapIdocsManager, public helper: helper) {

    }

    public ngOnInit(): void {
        this.initializeField();
    }

    /**
     * initializes the segment
     */
    public initializeField() {
        this.field = {
            id: this.helper.generateGuid(),
            deleted: '0',
            inbound: '0',
            outbound: '0',
            identifier: '0',
            active: '1',
            required: '1',
            sap_field: '',
            mapping_field: '',
            segment_id: this.sapIdocsManager.selectedsegment,
            mapping_rule: 'regular'
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
        this.sapIdocsManager.addField(this.field);
        this.added.emit(this.field);
        this.close();
    }

}

