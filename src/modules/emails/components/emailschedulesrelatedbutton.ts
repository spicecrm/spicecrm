/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";



@Component({
    selector: "email-schedules-realted-button",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedbutton.html",
})
export class EmailSchedulesRelatedButton {
    public disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        private toast: toast,
    ) {
    }

    public ngOnInit() {
        this.check();
    }

    private check() {
        let arrayOfLInks = [];
        Object.keys(this.model.fields).forEach(item => {
            if(this.model.fields[item].type == 'link' && this.model.fields[item].hasOwnProperty('vname') && !this.model.fields[item].hasOwnProperty('link_type')) {
                let module = this.language.getLabel(this.model.fields[item].vname).split(" ").join("");
                arrayOfLInks.push(module);
            }
        });
        window.console.log(arrayOfLInks);
    }
    public execute() {
        this.modal.openModal('EmailSchedulesRelatedModal', true, this.injector);
    }

}
