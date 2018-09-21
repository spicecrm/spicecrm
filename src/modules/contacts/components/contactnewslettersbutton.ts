import {Component, Input, HostBinding, ViewContainerRef} from "@angular/core";
import {Router} from "@angular/router";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "contact-newsletters-button",
    templateUrl: "./src/modules/contacts/templates/contactnewslettersbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
    }
})
export class ContactNewslettersButton {

    private showNeslettersModal: boolean = false;

    constructor(private language: language, private model: model, private modal: modal, private ViewContainerRef: ViewContainerRef) {
    }

    private showNewsletters() {
        this.modal.openModal("ContactNewsletters", true, this.ViewContainerRef.injector);
    }

}