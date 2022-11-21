/**
 * @module ModuleTelephony
 */
import {Component, ComponentRef, Input} from '@angular/core';

import {model} from "../../../services/model.service";
import {TelephonyCallSearchButton} from "./telephonycallsearchbutton";
import {TelephonyCallFoundBeansModal} from "./telephonycallfoundbeansmodal";

/**
 * open found beans modal
 */
@Component({
    selector: 'telephony-call-found-beans-button',
    templateUrl: '../templates/telephonycallfoundbeansbutton.html',
    providers: [model]
})
export class TelephonyCallFoundBeansButton extends TelephonyCallSearchButton {
    /**
     * holds the found entries
     */
    @Input() foundBeans: any[] = [];
    /**
     * open call found beans modal and update related
     */
    public execute() {
        this.modal.openModal('TelephonyCallFoundBeansModal').subscribe(
            (modalRef: ComponentRef<TelephonyCallFoundBeansModal>) => {
                modalRef.instance.foundBeans = this.foundBeans;
                modalRef.instance.selected.subscribe({
                    next: selectedModel => this.updateRelated(selectedModel)
                });
            }
        );
    }
}
