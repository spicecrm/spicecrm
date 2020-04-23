/**
 * @module ModuleScrum
 */
import {Component, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'sapidocs-manager-segment-details-field',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentdetailsfield.html'
})
export class SAPIDOCsManagerSegmentDetailsField implements OnDestroy {

    /**
     * holds the details about the idoc field
     */
    private field: any;

    /**
     * holds the subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language, private backend: backend, private sapIdocsManager: sapIdocsManager, private cdRef: ChangeDetectorRef) {
        this.subscriptions.add(
            this.sapIdocsManager.selectedfield$.subscribe(fieldid => {
                if(fieldid) {
                    this.field = this.sapIdocsManager.getField(fieldid);
                } else {
                    this.field = undefined;
                }
            })
        );
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private setboolfield(fieldname, fieldvalue){
        this.field[fieldname] = fieldvalue ? '1' : '0';
    }

}

