/**
 * @module ModuleSAPIDOCs
 */
import {Component, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {Subscription} from "rxjs";
import {sapIDOCFieldI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    selector: 'sapidocs-manager-segment-details-field',
    templateUrl: '../templates/sapidocsmanagersegmentdetailsfield.html'
})
export class SAPIDOCsManagerSegmentDetailsField implements OnDestroy {

    /**
     * holds the details about the idoc field
     */
    public field: sapIDOCFieldI;

    /**
     * holds the subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public language: language, public backend: backend, public sapIdocsManager: sapIdocsManager, public cdRef: ChangeDetectorRef) {
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

    public setboolfield(fieldname, fieldvalue){
        this.field[fieldname] = fieldvalue ? '1' : '0';
    }

}

