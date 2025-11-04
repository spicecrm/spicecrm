import {Component, inject} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {ObjectActionSetItemBase} from "../../../objectcomponents/interfaces/objectactionsetitembase";
import {broadcast} from "../../../services/broadcast.service";
import {language} from "../../../services/language.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

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
    private language = inject(language);
    private relatedModels = inject(relatedmodels);

    get hidden(): boolean {
        return this.model.getField('documentrevisionstatus') != 'r' || !!this.model.getField('parent_revision_id');
    }

    get disabled(){
        let usedLanguages = [this.model.getField('revision_language')];
        this.relatedModels.items.forEach(r => usedLanguages.push(r.revision_language));

        // build the options
        let options = this.language.getAvialableLanguages().filter(l => usedLanguages.indexOf(l.language) < 0).map(language => ({
            value: language.language,
            display: this.language.getLabel('LANG_' + language.language.toUpperCase())
        }));

        return options.length == 0;
    }

    /**
     * prompt to select a language to translate to and create a new translated revision
     */
    public execute() {

        let usedLanguages = [this.model.getField('revision_language')];
        this.relatedModels.items.forEach(r => usedLanguages.push(r.revision_language));

        // build the options
        let options = this.language.getAvialableLanguages().filter(l => usedLanguages.indexOf(l.language) < 0).map(language => ({
            value: language.language,
            display: this.language.getLabel('LANG_' + language.language.toUpperCase())
        })).sort((a, b) => a.display.localeCompare(b.display));

        if(options.length == 0){
            this.toast.sendToast('MSG_NO_FURTHER_LANGUAGES_AVAILABLE', 'info');
        } else {
            this.modal.prompt('input', '', 'LBL_LANGUAGE', null, options[0].value, options).subscribe(toLanguage => {

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
}