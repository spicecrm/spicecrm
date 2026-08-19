import {Component, ComponentRef, Injector, OnInit, Optional, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {EmailCloneAttachmentsModal} from "./emailcloneattachmentsmodal";
import {metadata} from "../../../services/metadata.service";
import {activitiytimeline} from "../../../services/activitiytimeline.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'email-create-contactbutton',
    templateUrl: '../templates/emailcreatecontactbutton.html',
    standalone: false,
    providers: [model]
})

/**
 * clones an attachment from an email to a bean
 */
export class EmailCreateContactButton {

    constructor(
        public model: model,
        public modal: modal,
        public toast: toast,
        public backend: backend,
        public configuration: configurationService,
        public metadata: metadata,
        @Optional() private activityTimeline: activitiytimeline,
        @Optional() private modelattachments: modelattachments,
        @SkipSelf() private parentModel: model
    ) {
    }

    /**
     * a getter that returns the disabled status.
     * check ACLs & if we've got a parent on the Email
     */
    get disabled() {
        return !this.metadata.checkModuleAcl('Contacts', 'create')
    }

    get hidden(){
        return  !this.configuration.getCapabilityConfig('generative_ai')?.isActive
    }

    /**
     * opens EmailCloneAttachmentsModal
     * where the cloning of attachments happens
     */
    public execute(){
        let awaitModal = this.modal.await('LBL_EXTRACTING');
        this.backend.getRequest(`module/Emails/${this.parentModel.id}/extractEmailSignature`).subscribe({
            next: (data) => {
                this.model.module = 'Contacts';
                this.model.id = undefined;
                this.model.initialize();

                if(this.activityTimeline.parent._module == 'Accounts'){
                    data.account_id = this.activityTimeline.parent.id;
                    data.account_name = this.activityTimeline.parent.getField('name');
                }

                data.email_addresses= {
                    beans: {}
                };

                let emailid = this.model.utils.generateGuid();
                data.email_addresses.beans[emailid] = {
                    "email_address": data.email_address,
                    "email_address_caps": data.email_address.toUpperCase(),
                    "primary_address": "1",
                    "opt_out": "0",
                    "invalid_email": "0"
                };

                this.model.addModel(null, null, data);
                awaitModal.emit(true);
            }, error: (e) => {
                awaitModal.emit(true);
            }
        })
    }

}