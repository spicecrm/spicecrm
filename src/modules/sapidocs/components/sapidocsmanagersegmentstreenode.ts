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
import {Component, Input, OnInit, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI, sapIDOCSegmentRelationI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    selector: '[sapidocs-manager-segments-tree-node]',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentstreenode.html',
    host: {
        '[attr.aria-expanded]': 'expanded',
        '[attr.aria-level]': 'level + 1'
    }
})

export class SAPIDOCsManagerSegmentsTreeNode implements OnInit {

    /**
     * the segment
     */
    @Input() private segmentrelation: any;

    /**
     * the level
     */
    @Input() private level: number = 1;

    /**
     * the segment details
     */
    // private segment: sapIDOCSegmentI;

    /**
     * the segments underneath this one
     */
    // private children: sapIDOCSegmentRelationI[] = [];

    /**
     * boolean flag if the node is expanded
     */
    private expanded: boolean = false;

    constructor(private language: language, private modal: modal, private injector: Injector, private sapIdocsManager: sapIdocsManager) {

    }

    /**
     * the segments underneath this one
     */
    get children(): sapIDOCSegmentRelationI[] {
        return this.segmentrelation.segment_id ? this.sapIdocsManager.getSegments(this.segmentrelation.segment_id) : [];
    }

    get segment(): sapIDOCSegmentI {
        return this.segmentrelation.segment_id ? this.sapIdocsManager.getSegmentById(this.segmentrelation.segment_id) : undefined;
    }

    /**
     * returns if the current segment is inactive
     */
    get segmentstyle() {

        if (this.segment.active == '0') {
            return {
                'text-decoration': 'line-through'
            };
        }

        return {};
    }

    public ngOnInit(): void {
        // get the segment
        // this.segment = this.sapIdocsManager.getSegmentById(this.segmentrelation.segment_id);

        // get the children
        // this.children = this.sapIdocsManager.getSegments(this.segmentrelation.segment_id);
    }

    /**
     * returns if the node is deleted
     */
    get deleted() {
        return this.segment.deleted == '1';
    }

    /**
     * returns a boolean if the current segment is selected
     */
    get selected() {
        return this.segment.id == this.sapIdocsManager.selectedsegment;
    }

    /**
     * toggle open or closed
     */
    private toggle() {
        this.expanded = !this.expanded;
    }

    /**
     * set the seleted node to the service
     */
    private selectNode(e: MouseEvent) {
        e.stopPropagation();
        this.sapIdocsManager.selectSegment(this.segment.id);
    }

    // open the add segment modal
    private addSegment() {
        this.modal.openModal('SAPIDOCsManagerSegmentAddModal', true, this.injector).subscribe(componentRef => {
            componentRef.instance.parentsegment_id = this.segment.id;
            componentRef.instance.added.subscribe((added: sapIDOCSegmentI) => {
                // get the children
                // this.children = this.sapIdocsManager.getSegments(this.segmentrelation.segment_id);

                // expand the node
                this.expanded = true;

                // select the new segment
                this.sapIdocsManager.selectSegment(added.id);
            });
        });
    }

    /**
     * @ignore
     *
     * a trackby function for the loop
     *
     * @param index
     * @param item
     */
    private trackByFn(index, item) {
        return item.id;
    }

}

