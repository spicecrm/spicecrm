/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'object-action-output-bean-modal-email-content',
    templateUrl: '../templates/objectactionoutputbeanmodalemailcontent.html',
    providers: [view, model]
})
export class ObjectActionOutputBeanModalEmailContent implements OnChanges {

    /**
     * the fieldset
     */
    @Input() public fieldset: any = null;

    /**
     * the filelist
     */
    @Input() public filelist: any = {};

    /**
     * the content for the attachment
     */
    @Input() public attachmentContent: string;

    /**
     * the parent model
     */
    @Input() public parent: any = {};

    /**
     * email sent
     */
    @Output() public email_sent: EventEmitter<string> = new EventEmitter<string>();

    /**
     * reference to the dynamic aded compontent
     *
     * @private
     */
    public attachmentsPanelRef: any;

    /**
     * inidcates that we are sending
     */
    public sending: boolean = false;

    constructor(
        public language: language,
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public view: view,
        public session: session
    ) {
    }

    public ngOnInit() {
        this.setModelData();
        this.setViewData();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.filelist) {
            if (this.attachmentsPanelRef) {
                this.attachmentsPanelRef.instance.setUploadFiles(this.filelist);
            }
        }
    }

    /**
     * set all email-model data
     * set copy rules from parent
     */
    public setModelData() {
        this.model.module = "Emails";

        this.model.initialize(this.parent);

        // set the new model data
        let modelData: any = {};
        modelData.parent_type = this.parent.module;
        modelData.parent_id = this.parent.data.id;
        modelData.parent_name = this.parent.data.name;
        modelData.isNew = true;
        modelData.assigned_user_id = this.session.authData.userId;
        modelData.assigned_user_name = this.session.authData.userName;
        modelData.modified_by_id = this.session.authData.userId;
        modelData.modified_by_name = this.session.authData.userName;
        modelData.date_entered = new Date();
        modelData.date_modified = new Date();
        this.model.setFields(modelData);

        this.model.startEdit();
    }

    /**
     * if it is allowed: go to edit mode
     */
    public setViewData() {
        this.view.setEditMode();
        this.view.isEditable = true;
    }


    public sendEmail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.setFields({
                type: 'out',
                to_be_sent: '1',
                from_addr: this.model.getField('from_addr_name'),
                to_addrs: this.model.getField('to_addrs_names')
            });

            this.model.save().subscribe(
                success => {
                    modalRef.instance.self.destroy();
                    // emit that the email has been sent
                    this.email_sent.emit();
                },
                error => {
                    modalRef.instance.self.destroy();
                    this.sending = false;
                }
            );
        });
    }
}
