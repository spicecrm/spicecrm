import {Component, OnInit, SkipSelf} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {Router} from "@angular/router";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'project-activity-track-time-modal',
    templateUrl: '../templates/projectactivitytracktimemodal.html',
    providers: [model]
})

/**
 *  creates a new ProjectActivity entry with time for any Bean
 */
export class ProjectActivityTrackTimeModal implements OnInit {

    /**
     * the fieldset to be rendered
     */
    public fieldset: string;

    /**
     * self instance of the modal
     */
    public self: any;

    constructor(
        private metadata: metadata,
        private model: model,
        @SkipSelf() public parent: model,
        private view: view,
        private router: Router,
        private toast: toast,
        private language: language,
        private modal: modal,
        private session: session
    ) {

        if(!this.parent.id && this.session.authData.user.parent_id && this.session.authData.user.parent_type){
            this.parent.module = this.session.authData.user.parent_type;
            this.parent.id = this.session.authData.user.parent_id;
            this.parent.initialize();
            this.parent.setField('name', this.session.authData.user.full_name)
        }

        this.model.module = 'ProjectActivities';
        this.model.initialize(this.parent);

        let componentConfig = this.metadata.getComponentConfig('ProjectActivityTrackTimeModal', 'ProjectActivities');
        if (componentConfig.fieldset) {
            this.fieldset = componentConfig.fieldset;
        }
    }

    ngOnInit() {
        this.model.startEdit();
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * save new ProjectActivity
     * @param goto
     */
    public saveProjectActivity(goto: boolean = false) {
        if (this.model.validate()) {
            const loadingModal = this.modal.await(this.language.getLabel('LBL_SAVING'));
            this.model.save(true).subscribe({
                next: () => {
                    loadingModal.next(true);
                    loadingModal.complete();
                    this.closeModal();

                    if (goto) this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);

                }, error: () => {
                    this.toast.sendToast('LBL_ERROR', 'error');
                    loadingModal.next(true);
                    loadingModal.complete();
                    this.closeModal();
                }
            });
        } else {
            this.toast.sendToast('MSG_INPUT_REQUIRED', 'error');
        }
    }

    /**
     * destroy the component
     * @public
     */
    public closeModal() {
        this.view.setViewMode();
        this.self.destroy();
    }
}