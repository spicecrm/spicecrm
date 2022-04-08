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
    templateUrl: '../templates/objectactionvcardbutton.html'
})
export class ObjectActionVCardButton {

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public backend: backend,
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
                {route: `/module/${this.model.module}/${this.model.id}/vcard`}, fileName, 'text/bin')
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
