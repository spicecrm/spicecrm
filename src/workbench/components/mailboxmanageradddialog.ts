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
    private closedialog: EventEmitter<any> = new EventEmitter<any>();
    @Input() private mailboxes: any[];

    private mailbox_name: string = '';
    private self: any = null;
    private saving: boolean = false;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private model: model) {

    }

    private closeDialog() {
        this.closedialog.emit(false);
        this.self.destroy();
    }

    private add() {
        this.model.module = 'Mailboxes';
        this.model.id = this.modelutilities.generateGuid();
        this.model.data.name = this.mailbox_name;
        this.saving = true;
        this.model.save().subscribe(() => {
            this.closedialog.emit(this.model.data);
            this.self.destroy();
        });
    }

    private getComponents() {
        return this.metadata.getSystemComponents();
    }
}