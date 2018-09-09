import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {SignServiceOrderModalComponent} from "./signserviceordermodal";
import {language} from "../../../services/language.service";
import {ServiceSelectQueueModal} from "./serviceselectqueuemodal";


@Component({
    selector: 'service-select-queue-button',
    templateUrl: 'app/modules/servicecomponents/templates/serviceselectqueuebutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '[style.display]': 'getDisplay()'
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class ServiceSelectQueueButton
{
    constructor(
        private model: model,
        private metadata: metadata,
        private language: language,
        private modal: modal,
    )
    {

    }

    showModal()
    {
        this.modal.openModal('ServiceSelectQueueModal').subscribe(
            cmp =>
            {
                cmp.instance.parentqueue_id = this.model.getField('servicequeue_id');
                cmp.instance.displaynote = true;
                cmp.instance.selectedqueue.subscribe(response => {
                    if(response != false){
                        this.model.setField('servicequeue_id', response.servicequeue_id);
                        this.model.setField('servicequeue_name', response.servicequeue_name);

                        if(!this.model.isEditing)
                            this.model.save();
                    };
                })
            }
        );
    }

    getDisplay() {
        if(this.model.data.acl && !this.model.data.acl.edit)
            return 'none';

        return this.model.isEditing ? 'none' : 'inherit';
    }
}