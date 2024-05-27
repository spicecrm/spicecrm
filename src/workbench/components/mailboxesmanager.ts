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

/**
 * part of the workbench to manage the mailboxes
 */
@Component({
    providers: [model, view, modellist],
    selector: "mailboxes-manager",
    templateUrl: "../templates/mailboxesmanager.html",
})
export class MailboxesManager {

    /**
     * the container with the view .. gets rendered daynamically
     */
    @ViewChild("viewcontainer", {read: ViewContainerRef, static: true}) public viewcontainer: ViewContainerRef;

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
        public model: model,
        public modelutils: modelutilities,
        public modelutilities: modelutilities,
        public toast: toast,
        public view: view,
        public configuration: configurationService
    ) {
        // initialize the modellist service
        this.modellist.initialize('Mailboxes');

        // force the data load
        this.modellist.getListData();

        this.model.module = "Mailboxes";
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
     * setter for the current mailbox that also triggert the rerendering and the load of the model
     *
     * @param mailbox
     */
    public handleSelectionChange(mailbox: any) {

        if (mailbox) {
            // set the current mailbox and go load the model
            this.model.id = mailbox.id;
            this.model.setData(mailbox, false);

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
            this.model.id = "";
            this.model.initialize();
        }
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
        this.model.reset();
        this.model.module = "Mailboxes";
    }

}
