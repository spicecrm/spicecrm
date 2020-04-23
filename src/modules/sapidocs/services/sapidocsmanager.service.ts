/**
 * @module ModuleSAPIDOCs
 */
import {ChangeDetectorRef, EventEmitter, Injectable} from '@angular/core';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {Md5} from "ts-md5";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {helper} from "../../../services/helper.service";
import {BehaviorSubject} from "rxjs";
import {
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

    constructor(private backend: backend, private helper: helper) {
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
     * gets the changed items
     */
    public getChanges() {
        let objects = ['segments', 'segmentrelations', 'fields'];

        let changed: any[] = [];

        // process segments
        for (let objecttype of objects) {
            for (let object of this[objecttype]) {
                if (!this.references[object.id]) {
                    if (object.deleted == '0') {
                        changed.push({
                            type: objecttype,
                            action: 'N',
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

        console.log(changed);

        return changed;
    }


    /**
     * returns the segment relations
     */
    public getIdocTypes(): sapIDOCSegmentRelationI[] {
        return this.segmentrelations ? this.segmentrelations.filter(segment => segment.parent_segment_id == null) : [];
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


