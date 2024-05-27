import {Component, ComponentRef, Injector} from '@angular/core';
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {ObjectStatusNetworkModal} from "./objectstatusnetworkmodal";
import {modal} from "../../services/modal.service";
import {ObjectStatusNetworkButtonItem} from "./objectstatusnetworkbuttonitem";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {toast} from "../../services/toast.service";

@Component({
    selector: 'object-status-network-open-modal-button',
    templateUrl: '../templates/objectstatusnetworkopenmodalbutton.html'
})

/**
 * Opens a ObjectStatusNetworkModal, where a fieldset and/or componentset can be rendered
 * It sets automatically the new value for the status field, which is defined in syststatusnetworks table for the item
 */
export class ObjectStatusNetworkOpenModalButton extends ObjectStatusNetworkButtonItem {

    constructor(public metadata: metadata,
                public model: model,
                public injector: Injector,
                public modal: modal,
                public language: language,
                public toast: toast,
                public view: view) {
        super(language, metadata, modal, model, toast, injector);
    }

    /**
     * opens ObjectStatusNetworkModal
     * with fieldset/componentset
     */
    public execute(): void {
        this.modal.openModal('ObjectStatusNetworkModal', true, this.injector).subscribe((modalRef: ComponentRef<ObjectStatusNetworkModal>) => {

            // inject data defined in the syststatusnetworks table for the button
            modalRef.instance.componentConfig = JSON.parse(this.item.componentconfig);
            modalRef.instance.statusFieldDomain = this.item.domain;
            modalRef.instance.statusTo = this.item.status_to;

            modalRef.instance.model.id = this.model.id;
            modalRef.instance.model.module = this.model.module;

            // initialize model before rendering modal
            modalRef.instance.model.initialize();
            modalRef.instance.model.setFields(this.model.data, true);

            // listen for changes in modal
            modalRef.instance.response.subscribe({
                next: modalData => {
                    if (!modalData) return;
                    this.model.setData(modalData);
                }
            });
        });
    }
}