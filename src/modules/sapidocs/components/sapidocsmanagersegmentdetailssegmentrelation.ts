/**
 * @module ModuleSAPIDOCs
 */
import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'sapidocs-manager-segment-details-segmentrelation',
    templateUrl: '../templates/sapidocsmanagersegmentdetailssegmentrelation.html'
})
export class SAPIDOCsManagerSegmentDetailsSegmentrelation implements OnInit, OnDestroy {

    /**
     * subscriptions for the component, unsubscribed in OnDestroy Lifecycle Hook
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * the current selected segment
     */
    public segmentrelation: any;

    constructor(public language: language, public backend: backend, public sapIdocsManager: sapIdocsManager, public cdRef: ChangeDetectorRef) {

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

    /**
     * loads the segment or sets it to undefined if none is passed in
     *
     * @param segmentid
     */
    public loadSegment(segmentid) {
        if (segmentid) {
            this.segmentrelation = this.sapIdocsManager.getSegmentRelationById(segmentid);
        } else {
            this.segmentrelation = undefined;
        }
    }


    public setboolfield(fieldname, fieldvalue){
        this.segmentrelation[fieldname] = fieldvalue ? '1' : '0';
    }

}

