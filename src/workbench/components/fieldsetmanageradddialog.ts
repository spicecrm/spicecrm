/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter,
} from '@angular/core';

import {backend} from '../../services/backend.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'fieldsetmanager-add-dialog',
    templateUrl: '../templates/fieldsetmanageradddialog.html'
})
export class FieldsetManagerAddDialog implements OnInit {
    @Output() public closedialog: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public module: string = '*';
    @Input() public parent: string = '';
    @Input() public edit_mode: string = '';


    public addType: string = 'fieldsetadd';
    public addName: string = '';
    public addFieldset: string = '';
    public fieldsettype: string = 'custom';
    public moduleFields: any[] = [];
    public self: any;

    constructor(public backend: backend, public language: language, public modelutilities: modelutilities, public metadata: metadata) {

    }

    public ngOnInit() {
        if (this.module && this.module != '*') {
            this.moduleFields = this.metadata.getModuleFields(this.module);
        }
    }

    public closeDialog() {
        this.self.destroy();
    }

    public onModalEscX() {
        this.closeDialog();
    }

    public add() {
        switch (this.addType) {
            case 'fieldsetadd':
                let fieldsetid = this.modelutilities.generateGuid();
                this.metadata.addFieldset(fieldsetid, this.module, this.addName, this.fieldsettype);
                this.metadata.addFieldsetToFieldset(this.modelutilities.generateGuid(), this.parent, fieldsetid);
                break;
            case 'fieldsetselect':
                this.metadata.addFieldsetToFieldset(this.modelutilities.generateGuid(), this.parent, this.addFieldset);
                break;
            case 'field':
                let fieldid = this.modelutilities.generateGuid();
                this.metadata.addFieldToFieldset(this.modelutilities.generateGuid(), this.parent, this.addName);
                break;
        }
        this.closedialog.emit(true);
        this.self.destroy();
    }

    public getFieldNames() {
        let fieldnames = [];

        for (let fieldname in this.moduleFields) {
            fieldnames.push(fieldname);
        }

        fieldnames.sort();

        return fieldnames;
    }

    get fieldsets() {
        return this.metadata.getFieldSets();
    }

}
