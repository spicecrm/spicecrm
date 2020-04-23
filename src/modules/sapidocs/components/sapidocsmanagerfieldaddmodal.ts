/**
 * @module ModuleSAPIDOCs
 */
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCFieldI, sapIDOCSegmentI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagerfieldaddmodal.html'
})
export class SAPIDOCsManagerFieldAddModal implements OnInit {

    private self: any;

    private parentsegment_id: string;

    private field: sapIDOCFieldI;

    private added: EventEmitter<sapIDOCFieldI> = new EventEmitter<sapIDOCFieldI>();

    constructor(private sapIdocsManager: sapIdocsManager, private helper: helper) {

    }

    public ngOnInit(): void {
        this.initializeField();
    }

    /**
     * initializes the segment
     */
    private initializeField() {
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
            segment_id: this.sapIdocsManager.selectedsegment
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
        this.sapIdocsManager.addField(this.field);
        this.added.emit(this.field);
        this.close();
    }

}

