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
    templateUrl: './src/workbench/templates/mailboxmanageradddialog.html',
    providers: [model]
})
export class MailboxManagerAddDialog {
    // @Output()
    closedialog: EventEmitter<any> = new EventEmitter<any>();
    @Input() mailboxes: Array<any>;

    mailbox_name: string = '';
    self: any = null;
    saving: boolean = false;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private model: model) {

    }

    closeDialog() {
        this.closedialog.emit(false);
        this.self.destroy();
    }

    add() {
        this.model.module = 'Mailboxes';
        this.model.id = this.modelutilities.generateGuid();
        this.model.data.name = this.mailbox_name;
        this.saving = true;
        this.model.save().subscribe(() => {
            this.closedialog.emit(this.model.data);
            this.self.destroy();
        });
    }

    getComponents() {
        return this.metadata.getSystemComponents();
    }
}