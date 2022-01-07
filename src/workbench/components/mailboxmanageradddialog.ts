/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {modelutilities} from "../../services/modelutilities.service";
import {model} from "../../services/model.service";

@Component({
    selector: 'mailboxmanager-add-dialog',
    templateUrl: '../templates/mailboxmanageradddialog.html',
    providers: [model]
})
export class MailboxManagerAddDialog {
    // @Output()
    public closedialog: EventEmitter<any> = new EventEmitter<any>();
    @Input() public mailboxes: any[];

    public mailbox_name: string = '';
    public self: any = null;
    public saving: boolean = false;

    constructor(public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities, public model: model) {

    }

    public closeDialog() {
        this.closedialog.emit(false);
        this.self.destroy();
    }

    public add() {
        this.model.module = 'Mailboxes';
        this.model.id = this.modelutilities.generateGuid();
        this.model.setField('name', this.mailbox_name);
        this.saving = true;
        this.model.save().subscribe(() => {
            this.closedialog.emit(this.model.data);
            this.self.destroy();
        });
    }

    public getComponents() {
        return this.metadata.getSystemComponents();
    }
}
