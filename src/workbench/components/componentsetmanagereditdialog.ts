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
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'componensetmanager-edit-dialog',
    templateUrl: '../templates/componentsetmanagereditdialog.html'
})
export class ComponentsetManagerEditDialog implements OnInit{
    @Output() closedialog: EventEmitter<any> = new EventEmitter<any>();
    @Input() componentset: string = '';
    @Input() edit_mode: string = '';

    componentsetname: string = '';
    componentsettype: string = 'custom';
    public module: string = '*';
    public showModuleField: boolean = false;

    self;

    constructor( public metadata: metadata, public language: language) {

    }

    ngOnInit(){
        if (this.showModuleField) {
            let componentset = this.metadata.getComponentSet(this.componentset);
            this.componentsetname = componentset.name + ' (custom)';
        }
    }

    cancelDialog() {
        this.closedialog.emit(false);
        this.self.destroy();
    }

    onModalEscX() {
        this.cancelDialog();
    }

    add() {
        this.closedialog.emit({name: this.componentsetname, type: this.componentsettype, module: this.module});
        this.self.destroy();
    }

}
