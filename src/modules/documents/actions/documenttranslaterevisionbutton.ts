import {Component, inject} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {ObjectActionSetItemBase} from "../../../objectcomponents/interfaces/objectactionsetitembase";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: 'document-translate-revision-button',
    template: `
        <system-label label="LBL_TRANSLATE"></system-label>`,
    standalone: false
})
export class DocumentTranslateRevisionButton extends ObjectActionSetItemBase {

    private backend = inject(backend);
    private modal = inject(modal);
    private toast = inject(toast);
    private broadcast = inject(broadcast);

    get hidden(): boolean {
        return this.model.getField('documentrevisionstatus') != 'r' || !!this.model.getField('parent_revision_id');
    }

    /**
     * prompt to select a language to translate to and create a new translated revision
     */
    public execute() {

        this.modal.prompt('input', '', 'LBL_LANGUAGE').subscribe(toLanguage => {

            if (!toLanguage) return;

            const loading = this.modal.await('LBL_PROCESSING');

            this.backend.postRequest(`module/DocumentRevisions/${this.model.id}/translate/${toLanguage}`).subscribe({
                next: () => {
                    loading.next(true);
                    loading.complete();
                    this.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');

                    this.broadcast.broadcastMessage('relatedmodels.reload', {module: 'DocumentRevisions'});
                },
                error: () => {
                    loading.next(true);
                    loading.complete();
                    this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                }
            });
        });
    }
}