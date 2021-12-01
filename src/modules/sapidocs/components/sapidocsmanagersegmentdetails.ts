/**
 * @module ModuleSAPIDOCs
 */
import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    selector: 'sapidocs-manager-segment-details',
    templateUrl: '../templates/sapidocsmanagersegmentdetails.html'
})
export class SAPIDOCsManagerSegmentDetails implements OnInit, OnDestroy {

    /**
     * subscriptions for the component, unsubscribed in OnDestroy Lifecycle Hook
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * the current selected segment
     */
    public segment: sapIDOCSegmentI;

    constructor(public language: language, public backend: backend, public modal: modal, public sapIdocsManager: sapIdocsManager, public cdRef: ChangeDetectorRef) {

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
            this.segment = this.sapIdocsManager.getSegmentById(segmentid);
        } else {
            this.segment = undefined;

            // detect changes ... nededed for the to boittom directive
            this.cdRef.detectChanges();
        }
    }

    /**
     * deletes the segment
     */
    public delete(e: MouseEvent) {
        e.stopPropagation();
        this.modal.confirm(this.language.getLabel('MSG_SAPIDOC_DELETE_SEGMENT', '', 'long'), this.language.getLabel('MSG_SAPIDOC_DELETE_SEGMENT')).subscribe(confirm => {
            if (confirm) {
                this.sapIdocsManager.deleteSegment(this.segment.id);
            }
        });
    }
}

