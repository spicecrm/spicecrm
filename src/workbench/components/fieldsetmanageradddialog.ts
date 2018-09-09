import {
    Component,
    Input,
    Output,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    EventEmitter,
} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
import {field} from "../../objectfields/components/field";

@Component({
    selector: 'fieldsetmanager-add-dialog',
    templateUrl: './src/workbench/templates/fieldsetmanageradddialog.html'
})
export class FieldsetManagerAddDialog implements OnInit {
    @Output() closedialog: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() module: string = '*';
    @Input() parent: string = '';
    @Input() metadata: any = {};
    @Input() edit_mode: string = '';


    addType: string = 'fieldsetadd';
    addName: string = '';
    addFieldset: string = '';
    fieldsettype: string = 'custom';
    moduleFields: Array<any> = [];
    self;

    constructor(private backend: backend, private language: language, private modelutilities: modelutilities) {

    }

    ngOnInit() {
        if (this.module && this.module != '*') {
            let params: any = {
                modules: JSON.stringify([this.module])
            };
            this.backend.getRequest('spiceui/core/fielddefs', params).subscribe((res: any) => {
                this.moduleFields = res.fielddefs[this.module];
            });
        }
    }

    closeDialog() {
        this.self.destroy();
    }

    onModalEscX() {
        this.closeDialog();
    }

    add() {
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

    getFieldNames(){
        let fieldnames = [];

        for(let fieldname in this.moduleFields)
            fieldnames.push(fieldname)

        fieldnames.sort();

        return fieldnames;
    }

    get fieldsets(){
        return this.metadata.getFieldSets();
    }

}