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
import {language} from '../../services/language.service';

@Component({
    selector: 'fieldsetmanager-copy-dialog',
    templateUrl: './src/workbench/templates/fieldsetmanagercopydialog.html'
})
export class FieldsetManagerCopyDialog implements OnInit{

    @Input() metaFieldSets: Array<any> = [];
    @Input() fieldset: string = '';
    @Input() sysModules: any = [];
    @Input() edit_mode: string = '';
    @Output() closedialog: EventEmitter<any> = new EventEmitter<any>();

    currentName: string = '';
    currentType: string = '';
    currentModule: string = '';


    self;

    constructor(private language: language) {
    }

    ngOnInit(){
        if(this.fieldset) {
            this.currentName = this.metaFieldSets[this.fieldset].name;
            this.currentModule = this.metaFieldSets[this.fieldset].module;
            if(this.edit_mode == "global"){
                this.currentType = this.metaFieldSets[this.fieldset].type;
            }else{
                this.currentType = "custom";
            }
        }
    }

    closeDialog() {
        this.self.destroy();
    }

    onModalEscX() {
        this.closeDialog();
    }

    copy() {
        this.closedialog.emit({fieldset: this.metaFieldSets[this.fieldset], type: this.currentType, module: this.currentModule, name: this.currentName});
        this.self.destroy();
    }

    validate(){
        if(this.fieldset && this.currentModule && this.currentType){
            return false;
        }else{
            return true;
        }
    }

}