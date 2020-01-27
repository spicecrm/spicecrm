/**
 * @module WorkbenchModule
 */
import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modellist} from "../../services/modellist.service";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    providers: [modellist, model, view],
    selector: "mailboxes-manager",
    templateUrl: "./src/workbench/templates/mailboxesmanager.html",
})
export class MailboxesManager {

    @ViewChild("viewcontainer", {read: ViewContainerRef, static: true}) private viewcontainer: ViewContainerRef;

    private _selected_mailbox;

    private renderedview: any[] = [];

    private headeractionset: string;

    constructor(
        private modellist: modellist,
        private backend: backend,
        private footer: footer,
        private language: language,
        private metadata: metadata,
        private model: model,
        private modelutils: modelutilities,
        private modelutilities: modelutilities,
        private toast: toast,
        private view: view,
        private configuration: configurationService
    ) {
        this.modellist.module = 'Mailboxes';

        this.model.module = "Mailboxes";
        this.view.isEditable = true;

        // get the transports
        if (!this.configuration.getData('mailboxtransports')) {
            this.configuration.setData('mailboxtransports', []);
            this.backend.getRequest('/mailboxes/transports').subscribe(transports => {
                this.configuration.setData('mailboxtransports', transports);
            });
        }

        let componentconfig = this.metadata.getComponentConfig('MailboxesManager', 'Mailboxes');
        this.headeractionset = componentconfig.actionset;
    }


    public getActionSets() {
        return this.metadata.getActionSets(this.model.module);
    }

    public getStylesheets() {
        return this.metadata.getHtmlStylesheetNames();
    }

    get selected_mailbox() {
        return this.model.id;
    }

    set selected_mailbox(mailbox) {
        let thismailbox = this.modellist.listData.list.find(mb => mb.id == mailbox)
        if (thismailbox) {
            // set the current mailbox and go load the model
            this._selected_mailbox = mailbox;
            this.model.id = mailbox;
            this.model.getData();

            // render new
            this.cleanView();
            this.renderedview = [];
            this.metadata.addComponent('ObjectRecordDetails', this.viewcontainer).subscribe(component => {
                this.renderedview.push(component);
            });
            this.metadata.addComponent('ObjectRelateContainer', this.viewcontainer).subscribe(component => {
                this.renderedview.push(component);
            });
        } else {
            this.cleanView();
            this._selected_mailbox = null;
            this.model.id = "";
            this.model.initialize();
        }
    }

    /**
     * cleans the current view
     */
    private cleanView() {
        // destroy what we have rendered thus far
        for (let thisview of this.renderedview) {
            thisview.destroy();
        }

    }

    private addMailbox() {
        /*
        this.metadata.addComponent("MailboxManagerAddDialog", this.footer.footercontainer).subscribe(
            (comp) => {
                comp.instance.closedialog.subscribe(
                    (data) => {
                        if (data) {
                            this.mailboxes.push(data);
                            this.selected_mailbox = data.id;
                            this.view.setEditMode('name');
                        }
                    });
            });

         */
    }

    private reset() {
        this.view.setViewMode();
        this.model.reset();
        this.model.module = "Mailboxes";
    }

    private deleteMailbox() {
        /*
        let this_index = 0;
        let sel_index = -1;
        for (let mailbox of this.mailboxes) {
            if (mailbox.id === this.selected_mailbox) {
                sel_index = this_index;
            }
            this_index++;
        }
        if (sel_index > -1) {
            this.mailboxes.splice(sel_index, 1);
        }
        this.model.delete().subscribe(() => {
            this.selected_mailbox = undefined;
            console.log(this.selected_mailbox);
        });

         */
    }

    private setAsDefault() {
        this.backend.getRequest("mailboxes/setdefaultmailbox", {mailbox_id: this.model.data.id})
            .subscribe(
                (res) => {
                    this.toast.sendToast(res);
                    this.model.setField("is_default", true);
                },
                (err) => {
                    console.log(err);
                },
            );
    }
}
