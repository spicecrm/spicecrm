import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

@Component({
    providers: [model, view],
    selector: "mailboxes-manager",
    templateUrl: "./app/workbench/templates/mailboxesmanager.html",
})
export class MailboxesManager {

    @ViewChild("relatecontainer", {read: ViewContainerRef}) relatecontainer: ViewContainerRef;
    relatecontainerElement: any = undefined;

    public mailboxes: any[];
    private _selected_mailbox;

    constructor(
        private backend: backend,
        private footer: footer,
        private language: language,
        private metadata: metadata,
        private model: model,
        private modelutils: modelutilities,
        private modelutilities: modelutilities,
        private toast: toast,
        private view: view,
    ) {
        this.model.module = "Mailboxes";
        this.view.isEditable = true;
        this.view.setEditMode();
        this.backend.all("Mailboxes").subscribe(
            (res) => {
                this.mailboxes = res;
            },
        );
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
        if (mailbox && mailbox.length > 0) {
            for (let entry of this.mailboxes) {
                if (entry.id == mailbox) {
                    this._selected_mailbox = mailbox;
                    this.model.data = entry;
                    this.model.id = mailbox;

                    // add resp rerender the user subpanel
                    this.addUserSubpanel();
                }
            }
        } else if (mailbox === undefined) {
            this._selected_mailbox = null;
            this.model.data = {};
            this.model.id = "";
            this.deleteUserSubpanel();
        }
    }

    private addMailbox() {
        this.metadata.addComponent("MailboxManagerAddDialog", this.footer.footercontainer).subscribe(
            (comp) => {
                comp.instance['closedialog'].subscribe(
                    (data) => {
                        if (data) {
                            this.mailboxes.push(data);
                            this.selected_mailbox = data.id;
                        }
                    });
            });
    }

    private reset() {
        this.view.setViewMode();
        this.model.reset();
        this.model.module = "Mailboxes";
    }

    private deleteMailbox() {
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
    }

    private saveChanges() {
        this.model.save(true);
    }

    private addUserSubpanel() {
        if (this.relatecontainerElement) {
            this.relatecontainerElement.destroy();
        }

        this.metadata.addComponent(
            "ObjectRelateContainer",
            this.relatecontainer,
        ).subscribe((userSubpanel) => {
            this.relatecontainerElement = userSubpanel;
        });
    }

    private deleteUserSubpanel() {
        this.relatecontainerElement.destroy();
    }

    private setAsDefault() {
        this.backend.getRequest("mailboxes/setdefaultmailbox", {mailbox_id: this.model.data.id})
            .subscribe(
                (res) => {
                    this.toast.sendToast(res);
                },
                (err) => {
                    console.log(err);
                },
            );
    }
}
