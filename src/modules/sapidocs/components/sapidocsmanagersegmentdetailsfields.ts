/**
 * @module ModuleScrum
 */
import {Component, OnDestroy} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'sapidocs-manager-segment-details-fields',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentdetailsfields.html'
})
export class SAPIDOCsManagerSegmentDetailsFields implements OnDestroy{

    private segmentFields: any[];

    private subscriptions: Subscription = new Subscription();

    constructor(private language: language, private backend: backend, private sapIdocsManager: sapIdocsManager) {
        this.subscriptions.add(
            this.sapIdocsManager.selectedsegment$.subscribe(segmentid => {
                this.segmentFields = this.sapIdocsManager.getSegmentFields(segmentid);
            })
        );
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}

