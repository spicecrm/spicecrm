/**
 * @module ObjectComponents
 */
import {Component, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {Router} from "@angular/router";
import {modal} from "../../../services/modal.service";

/**
 * Button for ServiceTickets that opens up a modal with an email form.
 */
@Component({
    templateUrl: "../templates/requestfeedbackbutton.html"
})
export class RequestFeedbackButton {

    public parent: any = {};
    public module: string = "";

    constructor(
        private language: language,
        private metadata: metadata,
        private modal: modal,
        private model: model,
        private router: Router,
        private ViewContainerRef: ViewContainerRef,
    ) {
    }

    private execute() {
        this.modal.openModal("OeamtcSendEmailModal", true, this.ViewContainerRef.injector).subscribe(
            (next: any) => {
                console.log('Email sent');
            }
        );
    }
}

