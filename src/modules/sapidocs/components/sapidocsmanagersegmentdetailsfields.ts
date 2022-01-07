/**
 * @module ModuleSAPIDOCs
 */
import {Component, OnDestroy, ChangeDetectorRef, Injector} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCFieldI, sapIDOCSegmentI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

@Component({
    selector: 'sapidocs-manager-segment-details-fields',
    templateUrl: '../templates/sapidocsmanagersegmentdetailsfields.html'
})
export class SAPIDOCsManagerSegmentDetailsFields implements OnDestroy {

    public segmentFields: sapIDOCFieldI[];

    public subscriptions: Subscription = new Subscription();

    constructor(public language: language, public modal: modal, public injector: Injector, public backend: backend, public sapIdocsManager: sapIdocsManager, public cdRef: ChangeDetectorRef) {
        this.subscriptions.add(
            this.sapIdocsManager.selectedsegment$.subscribe(segmentid => {
                this.segmentFields = this.sapIdocsManager.getFields(segmentid);
                this.sapIdocsManager.selectField(undefined);
            })
        );
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();

        this.sapIdocsManager.selectField(undefined);
    }

    public selectField(fieldid) {
        this.sapIdocsManager.selectField(fieldid);
    }

    /**
     * adds a field
     */
    public add() {
        this.modal.openModal('SAPIDOCsManagerFieldAddModal', true, this.injector).subscribe(componentRef => {
            componentRef.instance.added.subscribe((added: sapIDOCFieldI) => {
                // get the children
                this.segmentFields.unshift(added);

                // expand the node
                this.selectField(added.id);
            });
        });
    }

    /**
     * deletes a field
     *
     * @param fieldid
     */
    public delete(fieldid) {
        this.sapIdocsManager.deletefield(fieldid);
        this.segmentFields = this.sapIdocsManager.getFields();
    }

    /**
     * sorts the field list by the field provided
     *
     * @param field
     */
    public sortBy(field) {
        this.segmentFields.sort((a, b) => {
            if(!b[field]) return 1;
            if(!a[field]) return -1;
            return a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1;
        });
    }

}

