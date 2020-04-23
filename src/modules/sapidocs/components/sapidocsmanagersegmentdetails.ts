/**
 * @module ModuleSAPIDOCs
 */
import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'sapidocs-manager-segment-details',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentdetails.html'
})
export class SAPIDOCsManagerSegmentDetails implements OnInit, OnDestroy {

    /**
     * subscriptions for the component, unsubscribed in OnDestroy Lifecycle Hook
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * the current selected segment
     */
    private segment: any;

    constructor(private language: language, private backend: backend, private sapIdocsManager: sapIdocsManager, private cdRef: ChangeDetectorRef) {

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
    private loadSegment(segmentid) {
        if (segmentid) {
            this.segment = this.sapIdocsManager.getSegmentById(segmentid);
        } else {
            this.segment = undefined;

            // detect changes ... nededed for the to boittom directive
            this.cdRef.detectChanges();
        }
    }

}

