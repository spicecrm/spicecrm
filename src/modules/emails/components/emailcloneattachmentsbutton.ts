import {Component, ComponentRef, Injector, OnInit, Optional, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {EmailCloneAttachmentsModal} from "./emailcloneattachmentsmodal";
import {metadata} from "../../../services/metadata.service";
import {activitiytimeline} from "../../../services/activitiytimeline.service";

@Component({
    selector: 'email-clone-attachments-button',
    templateUrl: '../templates/emailcloneattachmentsbutton.html'
})

/**
 * clones an attachment from an email to a bean
 */
export class EmailCloneAttachmentsButton {

    constructor(
        public model: model,
        public modal: modal,
        public toast: toast,
        public injector: Injector,
        public metadata: metadata,
        @Optional() private activityTimeline: activitiytimeline,
        @SkipSelf() private parentModel: model
    ) {
    }

    /**
     * a getter that returns the disabled status.
     * check ACLs & if we've got a parent on the Email
     */
    get disabled() {
        return !this.metadata.checkModuleAcl('Emails', 'create') && !this.activityTimeline.parent || !this.parentModel;
    }

    /**
     * opens EmailCloneAttachmentsModal
     * where the cloning of attachments happens
     */
    public execute(){
        this.modal.openModal('EmailCloneAttachmentsModal', true, this.injector).subscribe((modalRef: ComponentRef<EmailCloneAttachmentsModal>) => {
            modalRef.instance.parent = this.activityTimeline?.parent ?? this.parentModel;
        });
    }

}