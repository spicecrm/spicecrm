/**
 * @module ObjectComponents
 */
import {
    Component, OnInit
} from '@angular/core';


import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {Subject} from "rxjs";

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: '../templates/objectoptimisticlockingmodal.html',
    providers: [view],
    styles: [
        'table { border-bottom: none; }',
        'table tr:last-child td { border-bottom: none; }'
    ]
})
export class ObjectOptimisticLockingModal implements OnInit {

    /**
     * reference to the modal itsefl
     * @private
     */
    public self: any = {};

    /**
     * the conflicts
     */
    public conflicts: any = {};


    public _conflicts = [];
    public originaldata: any = {};
    public fieldsToCopy = {};

    public responseSubject: Subject<any>;

    constructor(
        public language: language,
        public model: model,
        public view: view,
        public metadata: metadata,
        public modal: modal
    ) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        for (let fieldname in this.conflicts) {
            this._conflicts.push({
                field: fieldname,
                value: this.conflicts[fieldname].value,
                changes: this.conflicts[fieldname].changes
            });

            // create an object for the field for the original values
            this.originaldata[fieldname] = this.conflicts[fieldname].value;
        }
    }

    public cancel() {

        this.responseSubject.error(true);
        this.responseSubject.complete();

        // cancel the edit process and roll back
        // this.model.cancelEdit();

        // retrieve the model
        // this.model.getData();

        // destroy the component
        this.self.destroy();
    }

    public edit() {
        // got back to editing
        this.model.edit();

        // destroy the component
        this.self.destroy();
    }

    public save(goDetail: boolean = false) {
        this.copyFields();
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';

            // set the date modified to now
            this.model.setField('date_modified', new moment());

            this.model.save().subscribe(status => {
                if (status) {

                    /// if go Detail go to record)
                    if (goDetail) {
                        this.model.goDetail();
                    }

                    // destroy the component
                    this.self.destroy();
                }

                modalRef.instance.self.destroy();
            });
            // complete the subject
            this.responseSubject.next(true);
            this.responseSubject.complete();
        });
    }

    public copyFields() {
        for ( let fieldname in this.conflicts ) {
            if ( !this.fieldsToCopy[fieldname] ) this.model.setField( fieldname, this.conflicts[fieldname].value );
        }
    }

    public toggleChangeDetails(fieldname) {
        this.conflicts[fieldname].open = !this.conflicts[fieldname].open;
    }

    public select(fieldname) {
        this.fieldsToCopy[fieldname] = true;
    }

    public unselect(fieldname) {
        delete this.fieldsToCopy[fieldname];
    }

    public changeDetailsIcon(fieldname) {
        return this.conflicts[fieldname].open ? 'chevronup' : 'chevrondown';
    }

    public channgeOpen(fieldname) {
        return this.conflicts[fieldname].open ? true : false;
    }

}
