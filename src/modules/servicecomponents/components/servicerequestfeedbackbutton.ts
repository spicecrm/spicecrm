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
    templateUrl: "./src/modules/servicecomponents/templates/servicerequestfeedbackbutton.html"
})
export class ServiceRequestFeedbackButton {

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
        this.modal.openModal("ObjectActionMailModal", true, this.ViewContainerRef.injector).subscribe(
            (modal: any) => {
                modal.instance.titellabel = 'LBL_REQUEST_FEEDBACK';
                modal.instance.parent = this.model;
                modal.instance.mailsent.subscribe(sent => {
                    if (sent) {
                        let stopper = this.modal.await('LBL_SAVING')
                        // set the statu
                        this.model.startEdit();
                        this.model.setFields({serviceticket_status: 'Pending Input'});
                        this.model.save().subscribe(saved => {
                            stopper.emit(true);
                        });
                    }
                });
            }
        );
    }
}

