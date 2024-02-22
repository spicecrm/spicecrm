/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, Output} from "@angular/core";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modellist} from "../../services/modellist.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

/**
 * part of the workbench to manage the mailboxes
 */
@Component({
    providers: [view],
    selector: "mailboxes-manager-list",
    templateUrl: "../templates/mailboxesmanagerlist.html",
})

export class MailboxesManagerList {

    /**
     * the currently selected mailbox id
     */
    public selectedMailboxId: string;

    @Output() public selectedMailboxChange = new EventEmitter<any>();

    /**
     * any component reference that is rendered
     */
    public renderedview: any[] = [];

    /**
     * the actionset to be rendered in the header
     */
    public headeractionset: string;

    /**
     * the fieldset to be rendered on the left-hand side, where the list of mailboxes is
     */
    public listfieldset: string;

    constructor(
        public modellist: modellist,
        public backend: backend,
        public footer: footer,
        public language: language,
        public metadata: metadata,
        public modelutils: modelutilities,
        public modelutilities: modelutilities,
        public toast: toast,
        public view: view,
        public configuration: configurationService
    ) {
        this.view.isEditable = true;

        // get the transports
        if (!this.configuration.getData('mailboxtransports')) {
            this.configuration.setData('mailboxtransports', []);
            this.backend.getRequest('module/Mailboxes/transports').subscribe(transports => {
                this.configuration.setData('mailboxtransports', transports);
            });
        }

        let componentconfig = this.metadata.getComponentConfig('MailboxesManager', 'Mailboxes');
        this.headeractionset = componentconfig.actionset;
        this.listfieldset = componentconfig.listfieldset;
    }

    /**
     * getter for the mailboxes returning them sorted
     */
    get mailboxes() {
        return this.modellist.listData.list.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * setter for the current mailbox that also triggert the rerendering and the load of the model
     *
     * @param mailbox
     */
    public setSelectedMailbox(mailbox) {
        this.selectedMailboxId = mailbox.id;
        this.selectedMailboxChange.emit(mailbox);
    }

    /**
     * cleans the current view
     */
    public cleanView() {
        // destroy what we have rendered thus far
        for (let thisview of this.renderedview) {
            thisview.destroy();
        }

    }

    /**
     * resets the view and removes all currently rendered components
     */
    public reset() {
        this.view.setViewMode();
    }

}