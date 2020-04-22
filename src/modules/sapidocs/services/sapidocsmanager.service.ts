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


@Injectable()
export class sapIdocsManager {

    public segments: any[];
    public segmentrelations: any[];
    public segmentfields: any[];

    public selectedsegment: string;
    public selectedsegment$: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend) {
        this.loadSegments();
    }

    private loadSegments() {
        let segments = this.backend.getRequest('SAPIdocsManager/segments').subscribe(res => {
            this.segments = res.segments;
            this.segmentrelations = res.segmentrelations;
            this.segmentfields = res.segmentfields;
        });
    }

    public getIdocTypes() {
        return this.segmentrelations ? this.segmentrelations.filter(segment => segment.parent_segment_id == null) : [];
    }

    public getSegments(parent: string) {
        return this.segmentrelations ? this.segmentrelations.filter(segment => segment.parent_segment_id == parent) : [];
    }

    public selectSegment(segmentid){
        this.selectedsegment = segmentid;
        this.selectedsegment$.emit(segmentid);
    }

    /**
     * returns the segment by the id
     *
     * @param segmentid
     */
    public getSegmentById(segmentid) {
        return this.segments.find(segment => segment.id == segmentid);
    }

    public getSegmentFields(segmentid){
        return this.segmentfields.filter(segmentfield => segmentfield.segment_id == segmentid);
    }
}


