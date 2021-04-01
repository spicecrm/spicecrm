/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

