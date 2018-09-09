import {Component, Input, ElementRef, ViewChild, ViewContainerRef} from "@angular/core";
import {Subject} from "rxjs";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {navigation} from "../../../services/navigation.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

@Component({
    selector: 'mailbox-manager-emails',
    templateUrl: './src/modules/mailboxes/templates/mailboxmanageremails.html',
})
export class MailboxManagerEmails {

    constructor(
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private elementref: ElementRef,
    ) {}

    get containerStyle() {
        return {
            height: 'calc(100vh - ' + this.elementref.nativeElement.offsetTop + 'px)',
        };
    }

    private onScroll(e) { // todo make this work
        let element = this.elementref.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight && !this.mailboxesEmails.isLoading) {
            this.mailboxesEmails.loadMore();
        }
    }
}
