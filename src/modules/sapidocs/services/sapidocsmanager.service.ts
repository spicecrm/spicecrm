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
import {Injectable} from '@angular/core';
import {Md5} from "ts-md5";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {helper} from "../../../services/helper.service";
import {BehaviorSubject} from "rxjs";
import {
    sapIDOCTypeI,
    sapIDOCSegmentI,
    sapIDOCSegmentRelationI,
    sapIDOCFieldI
} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";


@Injectable()
export class sapIdocsManager {

    public segments: sapIDOCSegmentI[];
    public segmentrelations: sapIDOCSegmentRelationI[];
    public fields: sapIDOCFieldI[];

    /**
     *
     */
    private references: any = {};

    /**
     * the id of the current selected segment
     */
    public selectedsegment: string;

    /**
     * the eventemiter if another segment is selected
     */
    public selectedsegment$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    /**
     * the id of the currently selected field
     */
    public selectedfield: string;

    /**
     * the event emitter when the field changes
     */
    public selectedfield$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private backend: backend, private helper: helper, private toast: toast) {
        this.loadSegments();
    }

    /**
     * loads all segments and fields
     */
    private loadSegments() {
        let segments = this.backend.getRequest('SAPIdocsManager/segments').subscribe(res => {
            this.segments = res.segments;
            this.addToReference(this.segments);
            this.segmentrelations = res.segmentrelations;
            this.addToReference(this.segmentrelations);
            this.fields = res.fields;
            this.addToReference(this.fields);
        });
    }

    /**
     * builds an md5 hash reference of the original items
     *
     * @param items
     */
    private addToReference(items: any[]) {
        for (let item of items) {
            this.references[item.id] = Md5.hashStr(JSON.stringify(item));
        }
    }

    /**
     * updates the sagments on the backend
     */
    public updateSegments() {
        let changes = this.getChanges();
        if (changes.length > 0) {
            this.backend.postRequest('SAPIdocsManager/segments', {}, changes).subscribe(res => {
                this.toast.sendToast('saved', 'info');

                // reset references and rebuild
                this.references = [];
                this.segments = res.segments;
                this.addToReference(this.segments);
                this.segmentrelations = res.segmentrelations;
                this.addToReference(this.segmentrelations);
                this.fields = res.fields;
                this.addToReference(this.fields);

                this.selectedsegment$.next(this.selectedsegment);
                this.selectedfield$.next(this.selectedfield);
            });
        } else {
            this.toast.sendToast('no changes', 'info');
        }

    }

    /**
     * gets the changed items
     */
    private getChanges() {
        let objects = ['segments', 'segmentrelations', 'fields'];

        let changed: any[] = [];

        // process segments
        for (let objecttype of objects) {
            for (let object of this[objecttype]) {
                if (!this.references[object.id]) {
                    if (object.deleted == '0') {
                        changed.push({
                            type: objecttype,
                            action: 'I',
                            data: object
                        });
                    }
                } else if (this.references[object.id] != Md5.hashStr(JSON.stringify(object))) {
                    changed.push({
                        type: objecttype,
                        action: object.deleted == '0' ? 'U' : 'D',
                        data: object
                    });
                }
            }
        }

        return changed;
    }


    /**
     * returns the segment relations
     */
    public getIdocTypes(): sapIDOCTypeI[] {
        let idocTypes: sapIDOCTypeI[] = [];
        let rootSegments = this.segmentrelations ? this.segmentrelations.filter(segment => segment.parent_segment_id == null) : [];
        for (let rootSegment of rootSegments) {
            let idocType = idocTypes.find(id => id.idoctyp == rootSegment.idoctyp && id.mestyp == rootSegment.mestyp);
            if (!idocType) {
                idocType = {
                    idoctyp: rootSegment.idoctyp,
                    mestyp: rootSegment.mestyp,
                    segments: [rootSegment]
                };
                idocTypes.push(idocType);
            } else {
                idocType.segments.push(rootSegment);
            }
        }
        return idocTypes;
    }

    public addIdocType(idoctype: sapIDOCSegmentRelationI, segment: sapIDOCSegmentI) {
        this.segmentrelations.push(idoctype);
        this.segments.push(segment);
    }

    /**
     * returns related segments for a given segment id
     *
     * @param parent
     */
    public getSegments(parent: string): sapIDOCSegmentRelationI[] {
        return this.segmentrelations ? this.segmentrelations.filter(segment => segment.parent_segment_id == parent) : [];
    }

    /**
     * sets the current selected seghment t the passed in id and emits the value so other components can reload themselves
     * @param segmentid
     */
    public selectSegment(segmentid) {
        this.selectedsegment = segmentid;
        this.selectedsegment$.next(segmentid);
    }

    /**
     * select the field with the given ID
     *
     * @param fieldid
     */
    public selectField(fieldid) {
        this.selectedfield = fieldid;
        this.selectedfield$.next(fieldid);
    }

    /**
     * returns the segment by the id
     *
     * @param segmentid
     */
    public getSegmentById(segmentid): sapIDOCSegmentI {
        return this.segments.find(segment => segment.id == segmentid);
    }

    /**
     * adds a segment and the proper relation
     *
     * @param parentid
     * @param segment
     */
    public addSegment(parentid: string, segment: sapIDOCSegmentI) {
        this.segmentrelations.push({
            id: this.helper.generateGuid(),
            deleted: '0',
            required_export: '0',
            parent_segment_id: parentid,
            segment_id: segment.id
        });

        this.segments.push(segment);
    }

    /**
     * deletes a segment recursively
     *
     * @param segmentID
     */
    public deleteSegment(segmentID: string) {
        // get all related segments
        let relatedSegments = this.getSegments(segmentID);
        for (let relatedSegment of relatedSegments) {
            this.deleteSegment(relatedSegment.segment_id);
        }

        this.getSegmentById(segmentID).deleted = '1';
        this.getSegmentRelationById(segmentID).deleted = '1';
        for (let field of this.getFields(segmentID)) {
            field.deleted = '1';
        }

        // reset the currently selected segment
        if (this.selectedsegment == segmentID) {
            this.selectSegment(undefined);
        }
    }

    /**
     * returns the segment relationship by id of the segment
     *
     * @param segmentid
     */
    public getSegmentRelationById(segmentid): sapIDOCSegmentRelationI {
        return this.segmentrelations.find(rel => rel.segment_id == segmentid);
    }

    /**
     * gets the field for a segment or the curent seletced segment if no segment is sent in
     *
     * @param segmentid
     */
    public getFields(segmentid = null): sapIDOCFieldI[] {
        if (!segmentid) segmentid = this.selectedsegment;
        return this.fields.filter(segmentfield => segmentfield.segment_id == segmentid && segmentfield.deleted == '0');
    }

    /**
     * adds a field
     *
     * @param field
     */
    public addField(field: sapIDOCFieldI) {
        this.fields.push(field);
    }

    /**
     * mark a field with the given ID as deleted
     *
     * @param fieldid
     */
    public deletefield(fieldid) {
        this.fields.find(field => field.id == fieldid && field.deleted == '0').deleted = '1';

        // select none field if we just deleted the selected field
        if (this.selectedfield == fieldid) {
            this.selectField(undefined);
        }
    }

    /**
     * rturns the field by the passed in id
     */
    public getField(fieldid): sapIDOCFieldI {
        return this.fields.find(field => field.id == fieldid);
    }
}


