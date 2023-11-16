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
import {metadata} from '../../services/metadata.service';
import {Subject} from "rxjs";

@Component({
    selector: 'fieldsetmanager-copy-dialog',
    templateUrl: '../templates/fieldsetmanagercopydialog.html'
})
export class FieldsetManagerCopyDialog implements OnInit{

    @Input() fieldset: any;

    @Input() edit_mode: string = '';
    @Output() response: Subject<any> = new Subject<any>();

    /**
     * the list of modules
     */
    public modules: string[] = [];


    currentName: string = '';
    currentType: string = '';
    currentModule: string = '';


    self;

    constructor(public language: language, private metadata: metadata) {

        // get the modules fromt eh metadata service
        this.modules = this.metadata.getModules().sort();
    }

    ngOnInit(){
        this.currentName = this.fieldset.name + ' (custom)';
        this.currentModule = this.fieldset.module;
        if(this.edit_mode == "all"){
            this.currentType = this.fieldset.type;
        }else{
            this.currentType = "custom";
        }
    }

    close() {
        this.response.next(undefined);
        this.response.complete();
        this.self.destroy();
    }

    onModalEscX() {
        this.close();
    }

    copy() {
        this.response.next({fieldset: this.fieldset, type: this.currentType, module: this.currentModule, name: this.currentName});
    }

    validate(){
        if(this.fieldset && this.currentModule && this.currentType){
            return false;
        }else{
            return true;
        }
    }
}
