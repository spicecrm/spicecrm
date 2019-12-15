/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'object-action-output-bean-button',
    templateUrl: './src/objectcomponents/templates/objectactionvcardbutton.html'
})
export class ObjectActionVCardButton {

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
    ) {

    }
    /*
    * retrieve the bean content in VCARD format and download it
    * @return void
    */
    public execute() {
        let fileName = this.model.module + '_' + this.model.getField('summary_text') + '.vcf';
        this.modal.openModal('SystemLoadingModal').subscribe(loadingCompRef => {
            loadingCompRef.instance.messagelabel = 'MSG_GENERATING_VCARD';
            this.backend.downloadFile(
                {route: `/${this.model.module}/convert/${this.model.id}/to/VCard`}, fileName, 'text/bin')
                .subscribe(
                    next => {
                        loadingCompRef.instance.self.destroy();
                    },
                    err => {
                        loadingCompRef.instance.self.destroy();
                    }
                );
        });
    }
}
