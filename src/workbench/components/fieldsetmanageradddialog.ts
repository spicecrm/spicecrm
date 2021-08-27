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
    templateUrl: './src/workbench/templates/fieldsetmanageradddialog.html'
})
export class FieldsetManagerAddDialog implements OnInit {
    @Output() private closedialog: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() private module: string = '*';
    @Input() private parent: string = '';
    @Input() private edit_mode: string = '';


    private addType: string = 'fieldsetadd';
    private addName: string = '';
    private addFieldset: string = '';
    private fieldsettype: string = 'custom';
    private moduleFields: any[] = [];
    private self: any;

    constructor(private backend: backend, private language: language, private modelutilities: modelutilities, private metadata: metadata) {

    }

    public ngOnInit() {
        if (this.module && this.module != '*') {
            this.moduleFields = this.metadata.getModuleFields(this.module);
        }
    }

    private closeDialog() {
        this.self.destroy();
    }

    private onModalEscX() {
        this.closeDialog();
    }

    private add() {
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

    private getFieldNames() {
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
