/**
 * @module ModuleEmails
 */

import {Component, ComponentRef, effect, EventEmitter, Injector, Output, signal, WritableSignal} from "@angular/core";
import {configurationService} from "../../../services/configuration.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {Subject} from "rxjs";


/**
 * this renders a button as part of an actionset to plan an email
 *
 */
@Component({
    selector: "email-plan-modal",
    templateUrl: "../templates/emailplanmodal.html",
    standalone: false
})
export class EmailPlanModal {

    public self: ComponentRef<EmailPlanModal>;

    public response = new Subject<any>();

    constructor(
        public model: model,
        public configuration: configurationService,
        public modal: modal,
        public language: language,
        public toast: toast,

    ) {

    }

    public close(){
        this.response.complete();
        this.self.destroy();
    }

    public ngOnDestroy() {
        this.close()
    }

    public planEmail() {
        this.response.next(this.model.data);
        this.close();
    }
}