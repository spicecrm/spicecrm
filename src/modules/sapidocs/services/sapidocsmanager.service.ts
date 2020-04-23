/**
 * @module ModuleSAPIDOCs
 */
import {ChangeDetectorRef, EventEmitter, Injectable} from '@angular/core';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {helper} from "../../../services/helper.service";
import {BehaviorSubject} from "rxjs";
import {sapIDOCSegmentI, sapIDOCSegmentRelationI, sapIDOCFieldI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";


@Injectable()
export class sapIdocsManager {

    public segments: sapIDOCSegmentI[];
    public segmentrelations: sapIDOCSegmentRelationI[];
    public fields: sapIDOCFieldI[];

    public selectedsegment: string;
    public selectedsegment$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public selectedfield: string;
    public selectedfield$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private backend: backend, private helper: helper) {
        this.loadSegments();
    }

    private loadSegments() {
        let segments = this.backend.getRequest('SAPIdocsManager/segments').subscribe(res => {
            this.segments = res.segments;
            this.segmentrelations = res.segmentrelations;
            this.fields = res.fields;
        });
    }

    public getIdocTypes() {
        return this.segmentrelations ? this.segmentrelations.filter(segment => segment.parent_segment_id == null) : [];
    }

    public getSegments(parent: string): sapIDOCSegmentRelationI[] {
        return this.segmentrelations ? this.segmentrelations.filter(segment => segment.parent_segment_id == parent) : [];
    }

    public selectSegment(segmentid) {
        this.selectedsegment = segmentid;
        this.selectedsegment$.next(segmentid);
    }


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
     * mark a field with the given ID as deleted
     *
     * @param fieldid
     */
    public deletefield(fieldid) {
        this.fields.find(field => field.id == fieldid && field.deleted == '0').deleted = '1';
    }

    /**
     * rturns the field by the passed in id
     */
    public getField(fieldid): sapIDOCFieldI {
        return this.fields.find(field => field.id == fieldid);
    }
}


