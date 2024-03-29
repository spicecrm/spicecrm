/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter, OnChanges, SimpleChanges,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';

@Component({
    selector: 'actionsetmanager-add-dialog',
    templateUrl: '../templates/actionsetmanageradddialog.html'
})
export class ActionsetManagerAddDialog implements OnInit  {

    @Input() public sysModules = [];
    @Input() public actionsetModule: string = '';
    @Input() public mode: string = '';
    @Input() public edit_mode: string = '';
    @Input() public actionsetName: string = '';

    @Output() public closedialog: EventEmitter<any> = new EventEmitter<any>();

    public actionsetType: string = 'custom';

    public globalEdit: boolean = false;

    public modalTitle: string = "";

    public self;

    constructor(public backend: backend, public metadata: metadata, public language: language) {}

    public ngOnInit() {
        if(this.mode == "copy") {
            this.modalTitle = this.language.getLabel('LBL_COPY_ACTIONSET');
        } else {
            this.modalTitle = this.language.getLabel('LBL_NEW_ACTIONSET');
        }
    }

    public closeDialog() {
        this.self.destroy();
    }

    public onModalEscX() {
        this.closeDialog();
    }

    public add() {
        this.closedialog.emit({name: this.actionsetName, type: this.actionsetType, module: this.actionsetModule});
        this.self.destroy();
    }

}
