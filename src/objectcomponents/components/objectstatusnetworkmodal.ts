import {Component, ComponentRef, OnInit} from '@angular/core';
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {view} from "../../services/view.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {Subject} from "rxjs";

@Component({
    selector: 'object-status-network-modal',
    templateUrl: '../templates/objectstatusnetworkmodal.html',
    providers: [model, view]
})

/**
 * renders a fieldset or a componentset for a ObjectStatusNetworkButtonItem
 */
export class ObjectStatusNetworkModal implements OnInit {

    /***
     * self reference to modal
     */
    public self: ComponentRef<ObjectStatusNetworkModal>;

    /**
     * holds component config
     */
    public componentConfig: {
        fieldset?: string,
        componentset?: string,
    };

    /**
     * holds the domain status field
     */
    public statusFieldDomain: string = '';

    /**
     * holds the new status
     */
    public statusTo: string = '';

    /**
     * response observable
     */
    public response: Subject<any> = new Subject<any>();

    constructor(public model: model,
                public metadata: metadata,
                public view: view,
                public toast: toast,
                public language: language,
                public modal: modal) {
    }

    public ngOnInit(): void {
        // provide a new view for the modal
        this.view.isEditable = true;
        this.view.setEditMode();
        this.model.startEdit();

        // retrieve config
        this.getConfig();

        if (this.componentConfig) this.changeStatusVal();
    }

    /**
     * retrieves config from Module Configuration
     * if componentconfig is not defined on the ObjectStatusNetworkOpenModalButton
     * in the syststatusnetworks table
     */
    public getConfig(): void {
        if (!this.componentConfig) {
            this.componentConfig = this.metadata.getComponentConfig('ObjectStatusNetworkModal', this.model.module);
        }
    }

    /**
     * sets new value for status field
     */
    public changeStatusVal(): void {
        const statusField = this.statusFieldDomain.split("_dom")[0];
        this.model.setField(statusField, this.statusTo);
    }

    /**
     * saves changes
     */
    public save(): void {

        if (!this.model.validate()) return;

        let loadingModal = this.modal.await(this.language.getLabel('LBL_SAVING'));

        this.model.save(true).subscribe(res => {

            loadingModal.next(true);
            loadingModal.complete();
            this.close();
        });
    }

    /**
     * destroys the modal & ends editing mode
     */
    public close(): void {
        this.model.cancelEdit();
        this.response.next(this.model.data);
        this.self.destroy();
    }
}