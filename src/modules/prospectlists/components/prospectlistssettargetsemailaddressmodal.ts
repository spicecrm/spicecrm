import {Component, ComponentRef, OnDestroy} from '@angular/core';
import {ModalComponentI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {Subject} from "rxjs";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'prospect-lists-set-targets-email-address-modal',
    templateUrl: '../templates/prospectlistssettargetsemailaddressmodal.html',
    providers: [view]
})

export class ProspectListsSetTargetsEmailAddressModal implements ModalComponentI, OnDestroy {
    /**
     * component instance reference
     */
    self: ComponentRef<ProspectListsSetTargetsEmailAddressModal>;
    /**
     * items passed from the parent component
     */
    public items: { id: string, summary_text: string;}[] = [];
    /**
     * modal response to pass data to parent
     */
    public response = new Subject<{ id: string}[]>();
    /**
     * email address field name
     */
    public emailAddressFieldName: string;

    constructor(public model: model, private view: view) {
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

    public close() {
        this.response.complete();
        this.self.destroy();
    }

    public confirm() {
        this.response.next(this.items);
        this.close();
    }

    public ngOnDestroy() {
        this.response.complete();
    }
}