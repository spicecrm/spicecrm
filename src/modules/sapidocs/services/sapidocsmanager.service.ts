/**
 * @module ModuleReportsDesigner
 */
import {ChangeDetectorRef, EventEmitter, Injectable} from '@angular/core';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {BehaviorSubject} from "rxjs";


@Injectable()
export class sapIdocsManager {

    public segments: any[];
    public segmentrelations: any[];
    public fields: any[];

    public selectedsegment: string;
    public selectedsegment$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public selectedfield: string;
    public selectedfield$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private backend: backend) {
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

    public getSegments(parent: string) {
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
    public getSegmentById(segmentid) {
        return this.segments.find(segment => segment.id == segmentid);
    }

    public getSegmentRelationById(segmentid) {
        return this.segmentrelations.find(rel => rel.segment_id == segmentid);
    }

    /**
     * gets the field for a segment or the curent seletced segment if no segment is sent in
     *
     * @param segmentid
     */
    public getFields(segmentid = null) {
        if(!segmentid) segmentid = this.selectedsegment;
        return this.fields.filter(segmentfield => segmentfield.segment_id == segmentid && segmentfield.deleted == '0');
    }

    /**
     * mark a field with the given ID as deleted
     *
     * @param fieldid
     */
    public deletefield(fieldid){
        this.fields.find(field => field.id == fieldid && field.deleted == '0').deleted = 1;
    }

    /**
     * rturns the field by the passed in id
     */
    public getField(fieldid){
        return this.fields.find(field => field.id == fieldid);
    }
}


