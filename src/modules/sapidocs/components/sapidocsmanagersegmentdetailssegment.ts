/**
 * @module ModuleSAPIDOCs
 */
import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'sapidocs-manager-segment-details-segment',
    templateUrl: '../templates/sapidocsmanagersegmentdetailssegment.html'
})
export class SAPIDOCsManagerSegmentDetailsSegment implements OnInit, OnDestroy {

    /**
     * subscriptions for the component, unsubscribed in OnDestroy Lifecycle Hook
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * the current selected segment
     */
    public segment: any;

    constructor(public language: language, public metadata: metadata, public backend: backend, public sapIdocsManager: sapIdocsManager, public cdRef: ChangeDetectorRef) {

    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.sapIdocsManager.selectedsegment$.subscribe(segmentid => {
                this.loadSegment(segmentid);
            })
        );
    }

    /**
     * unsubscribe from the service
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    get module(){
        return this.metadata.getModuleById(this.segment.sysmodule_id);
    }

    set module(module){
        let moduledefs = this.metadata.getModuleDefs(module);
        this.segment.sysmodule_id = moduledefs.id;
    }

    /**
     * loads the segment or sets it to undefined if none is passed in
     *
     * @param segmentid
     */
    public loadSegment(segmentid) {
        if (segmentid) {
            this.segment = this.sapIdocsManager.getSegmentById(segmentid);
        } else {
            this.segment = undefined;
        }
    }

    /**
     * sets the bool value to the field
     *
     * @param fieldname
     * @param fieldvalue
     */
    public setboolfield(fieldname, fieldvalue){
        this.segment[fieldname] = fieldvalue ? '1' : '0';
    }

}

