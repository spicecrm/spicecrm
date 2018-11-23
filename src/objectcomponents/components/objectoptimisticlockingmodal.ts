import {
    Component, OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Subject, Observable} from 'rxjs';

import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

declare var moment: any;

@Component({
    templateUrl: './src/objectcomponents/templates/objectoptimisticlockingmodal.html',
    providers: [view],
    styles: [
        'table { border-bottom: none; }',
        'table tr:last-child td { border-bottom: none; }'
    ]
})
export class ObjectOptimisticLockingModal implements OnInit {

    private self: any = {};
    public conflicts: any = {};
    private _conflicts = [];
    private originaldata: any = {};
    private fieldsToCopy = {};

    constructor(
        private language: language,
        private model: model,
        private view: view,
        private metadata: metadata,
        private modal: modal
    ) {
        // this.view.isEditable = true;
        // this.view.setEditMode();
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

    private cancel() {
        // cancel the edit process and roll back
        this.model.cancelEdit();

        // retrieve the model
        this.model.getData();

        // destroy the component
        this.self.destroy();
    }

    private edit() {
        // got back to editing
        this.model.edit();

        // destroy the component
        this.self.destroy();
    }

    private save(goDetail: boolean = false) {
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
        });
    }

    private copyFields() {
        for ( let fieldname in this.conflicts ) {
            if ( !this.fieldsToCopy[fieldname] ) this.model.setField( fieldname, this.conflicts[fieldname].value );
        }
    }

    private toggleChangeDetails(fieldname) {
        this.conflicts[fieldname].open = !this.conflicts[fieldname].open;
    }

    private select(fieldname) {
        this.fieldsToCopy[fieldname] = true;
    }

    private unselect(fieldname) {
        delete this.fieldsToCopy[fieldname];
    }

    private changeDetailsIcon(fieldname) {
        return this.conflicts[fieldname].open ? 'chevronup' : 'chevrondown';
    }

    private channgeOpen(fieldname) {
        return this.conflicts[fieldname].open ? true : false;
    }

}
