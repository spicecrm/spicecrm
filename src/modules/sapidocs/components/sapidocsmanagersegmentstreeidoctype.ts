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
import {sapIDOCSegmentI, sapIDOCTypeI} from "../interfaces/moudesapidocs.interfaces";

@Component({
    selector: '[sapidocs-manager-segments-tree-ipoc-type]',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentstreeidoctype.html',
    host: {
        '[attr.aria-expanded]': 'expanded',
        '[attr.aria-level]': 'level + 1'
    }
})

export class SAPIDOCsManagerSegmentsTreeIdocType implements OnInit {

    /**
     * the segment
     */
    @Input() private idoctype: sapIDOCTypeI;

    /**
     * the level
     */
    @Input() private level: number = 0;

    /**
     * the segments underneath this one
     */
    private children: any[] = [];

    /**
     * if the node is expanded
     */
    private expanded: boolean = false;

    constructor(private language: language, private modal: modal, private injector: Injector, private sapIdocsManager: sapIdocsManager) {

    }

    public ngOnInit(): void {

        // get the children
        this.children = this.idoctype.segments;
        this.children.sort((a, b) => {
           return a.segment_order > b.segment_order ? 1 : -1;
        });
    }

    /**
     * toggle open or closed
     */
    private toggle() {
        this.expanded = !this.expanded;
    }

    private select(e: MouseEvent) {
        e.stopPropagation();
        this.sapIdocsManager.selectSegment(undefined);
    }


    // open the add segment modal
    private addSegment() {
        this.modal.openModal('SAPIDOCsManagerSegmentAddModal', true, this.injector).subscribe(componentRef => {
            componentRef.instance.idoctyp = this.idoctype.idoctyp;
            componentRef.instance.mestyp = this.idoctype.mestyp;
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
     * returns if the node is deleted
     */
    get deleted() {
        return false; // this.idoctype.deleted == '1';
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

