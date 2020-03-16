/**
 * @module ModuleEmails
 */

import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "email-schedules-views",
    templateUrl: "./src/modules/emails/templates/emailschedulesview.html",
    providers: [modellist],
})

export class EmailSchedulesView {
    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private modellist: modellist,
                private backend: backend,
                private toast: toast) {
    }


    public ngOnInit() {

        window.console.log(this.modellist)
    }

}
