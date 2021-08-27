/**
 * @module ModuleKnowledge
 */
import {Component} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {KnowledgeService} from "../services/knowledge.service";

@Component({
    selector: 'knowledge-browser',
    templateUrl: "./src/modules/knowledge/templates/knowledgereleaseallbutton.html"
})
export class KnowledgeReleaseAllButton {

    public disabled: boolean = true;

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private toast: toast,
                private knowledgeService: KnowledgeService,
                private backend: backend) {
    }

    public ngOnInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public execute() {
        this.modal.confirm(this.language.getLabel('MSG_RELEASE_ALL_CONFIRM'), this.language.getLabel('LBL_RELEASE_ALL')).subscribe(answer => {
            if (answer) {
                this.backend.postRequest(`module/KnowledgeDocuments/${this.model.id}/release/all`).subscribe(
                    res => {
                        if (res && res.released) {
                            this.model.setField('status', 'Released');
                            this.knowledgeService.documentsList.forEach(doc => {
                                if (doc.id == this.model.id || res.ids[doc.id]) {
                                    doc.name = doc.name.replace(/\(.*\)/g, '') + ' (Released)';
                                    doc.status = 'Released';
                                }
                            } );
                            this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                        }
                    },
                    err => this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error'));
            }
        });
    }

    private handleDisabled(mode) {
        if (this.model.getFieldValue('status') != 'Draft') {
            return this.disabled = true;
        }
        if (this.model.data.acl && !this.model.checkAccess('edit')) {
            return this.disabled = true;
        }
        this.disabled = mode == 'edit';
    }
}
