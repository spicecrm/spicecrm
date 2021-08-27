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
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';

@Component({
    selector: 'fieldsetmanager-edit-dialog',
    templateUrl: './src/workbench/templates/fieldsetmanagereditdialog.html'
})
export class FieldsetManagerEditDialog implements OnInit{

    @Input() fieldset: string = '';
    @Input() edit_mode: string = '';

    @Output() closedialog: EventEmitter<any> = new EventEmitter<any>();

    fieldsetname: string = '';
    fieldsettype: string = '';

    adding: boolean = false;
    globalEdit: boolean = false;

    modalTitle: string = "";

    self;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private configurationService: configurationService) {
        this.modalTitle = this.language.getAppLanglabel('LBL_EDIT');
    }

    ngOnInit(){
        if(this.fieldset) {
            this.fieldsetname = this.metadata.getFieldsetName(this.fieldset);
            this.fieldsettype = this.metadata.getFieldset(this.fieldset).type;
            this.adding = false;
        } else {
            this.modalTitle = this.language.getAppLanglabel('LBL_ADD');
            this.fieldsettype = 'custom';
            this.adding = true;
        }
    }

    closeDialog() {
        this.self.destroy();
    }

    onModalEscX() {
        this.closeDialog();
    }

    add() {
        this.closedialog.emit({name: this.fieldsetname, type: this.fieldsettype});
        this.self.destroy();
    }

}