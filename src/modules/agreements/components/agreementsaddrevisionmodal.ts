/**
 * @module ModuleAgreements
 */
import {Component, ComponentRef, OnInit, SkipSelf} from '@angular/core';
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {view} from "../../../services/view.service";
import {Subject} from "rxjs";
import {modelattachments} from "../../../services/modelattachments.service";
import {Router} from "@angular/router";

@Component({
    selector: 'agreements-add-revision-modal',
    templateUrl: '../templates/agreementsaddrevisionmodal.html',
    providers: [view, model]
})
/**
 * creates a new AgreementRevision from Agreement
 */
export class AgreementsAddRevisionModal implements OnInit {

    /**
     * the componentset id defined in config
     * */
    public componentset: string = '';

    /**
     * holds spiceattachment from injector
     * */
    public spiceattachment: any = {};

    /**
     * reference to self as the modal window
     */
    public self: ComponentRef<AgreementsAddRevisionModal>;

    /**
     * holds uploaded file data
     */
    public files: any = {};

    /**
     * holds agreement revision component id
     */
    public revComponent: any = {};

    /**
     * holds revision number
     */
    public revNumber: number = 1;

    /**
     * holds revision name
     */
    public revName: string;

    /**
     * holds Observable
     */
    public responseSubject = new Subject<boolean>();

    constructor(
        public language: language,
        public model: model,
        @SkipSelf() public parentModel: model,
        public view: view,
        public toast: toast,
        public metadata: metadata,
        public backend: backend,
        public modal: modal,
        public modelattachments: modelattachments,
        public router: Router) {
        this.model.module = 'AgreementRevisions';
        this.model.initialize();
    }

    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('AgreementsAddRevisionModal', this.model.module);
        this.componentset = this.revComponent.revComponent;

        // enable edit of the modal
        this.view.isEditable = true;
        this.view.setEditMode();

        // initialize parentmodel for copyrules
        this.model.initialize(this.parentModel);
        this.model.startEdit();

        // initialize modelattachments model for AgreementRevisions
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;

        // display version_number and name in the modal
        this.generateRevNumb();
        this.generateRevName();
    }

    /**
     * generates non-static revision number
     * call to backend to check whether the Agreement has already a revision
     *  default version_number = 1;
     * */
    public generateRevNumb() {
        let relatedRecords = this.parentModel.getRelatedRecords('agreementrevisions').sort((a, b) => a.version_number - b.version_number).reverse();
        if (relatedRecords.length > 0) {
            this.revNumber = relatedRecords[0].version_number + 1;
        }

        this.model.setField('version_number', this.revNumber);
        return this.revNumber;
    }

    /**
     * generates non static revision name
     */
    public generateRevName() {
        this.revName = this.revNumber + '_' + this.spiceattachment.filename;
        this.model.setField('name', this.revName);
        return this.revName;
    }

    /**
     * a getter that checks that the required fields are not empty
     */
    get canAdd() {
        return this.model.validate();
    }

    /**
     * sends data to backend and creates a new revision
     * * @param goto
     */
    public addRevision(goto: boolean = false) {
        // store model to avoid loosing data
        let currModelData = this.model.data;

        if (this.model.validate()) {
            this.modelattachments.files = [];
            // upload AgreementRevision as SpiceAttachment
            // wait until attachment has been saved to avoid overwriting modelattachments.module
            this.modelattachments.uploadAttachmentsBase64(this.files).subscribe({
                next: (res) => {
                    // re-initialize model data in case data was lost
                    this.model.data = currModelData;
                    this.model.save();

                    // add related records so the parent model gets the newly added revision
                    this.model.setField('id', this.model.id);
                    this.parentModel.addRelatedRecords('agreementrevisions', [this.model.data], false);

                    this.responseSubject.next(true);

                    if (goto) {
                        this.router.navigate(["/module/AgreementRevisions/" + this.model.id]);
                    }
                },
                error: () => {
                    this.toast.sendToast(this.language.getLabel('LBL_CREATING_REVISION_ATTACHMENT'), 'error');
                }
            });
            this.closeModal();
        }
    }

    /**
     * destroy the component
     * @public
     */
    public closeModal() {
        this.model.cancelEdit();
        this.self.destroy();
    }

}
