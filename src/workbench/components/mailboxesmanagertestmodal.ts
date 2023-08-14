/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, OnInit} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {session} from "../../services/session.service";

@Component({
    templateUrl: "../templates/mailboxesmanagertestmodal.html",
})
export class MailboxesmanagerTestModal implements OnInit {

    /**
     * reference to self
     */
    public self: any = {};

    /**
     * set to true when the test succeeds
     */
    public validConnection: boolean;

    /**
     * event emiter when the modal closes with the test status
     */
    public isvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the tgest email address, in on init defaulted to the users email
     */
    public testemailaddress: string = "";

    /**
     * indicates that the test is running
     */
    public testing: boolean = false;

    /**
     * indicates that the test has been done
     */
    public tested: boolean = false;

    /**
     * the type of test .. sms or email
     * differemntiates the header label and the defualt value
     */
    public testtype: 'email' | 'sms' = 'email';
    /**
     * holds the error message to display
     */
    public errorMessage: string;

    constructor(
        public backend: backend,
        public language: language,
        public model: model,
        public session: session
    ) {

    }

    /**
     * initializes and loads the users email address in case of email
     */
    public ngOnInit(): void {
        switch (this.testtype) {
            case 'sms':
                break;
            default:
                this.testemailaddress = this.session.authData.email;
                break;
        }
    }

    /**
     * tests the connection
     */
    public testConnection() {
        this.testing = true;
        this.testemailaddress = this.testemailaddress.trim();
        let modelData = this.model.utils.spiceModel2backend('Mailboxes', this.model.data);
        this.backend.postRequest("module/Mailboxes/test", {}, {data: modelData, test_email: this.testemailaddress}).subscribe({
            next: (response: any) => {
                    if (response.result === true) {
                        this.validConnection = true;
                    } else {
                        this.validConnection = false;
                        this.errorMessage = response.errors;
                    }

                    this.tested = true;
                    this.testing = false;
                },
        error: (err: any) => {
            this.tested = false;
            this.testing = false;
            this.validConnection = undefined;
            this.errorMessage = err.error?.error?.message ?? err.error?.message;
        }
        });
    }

    /**
     * closes the modal and emits the result
     */
    public close() {
        this.isvalid.emit(this.validConnection);
        this.self.destroy();
    }

    /**
     * handles when esc is pressed on the modal
     */
    public onModalEscX() {
        this.close();
    }

    /**
     * returns the label for the testtype
     */
    get testtypelabel(){
        return this.language.getLabel(this.testtype == 'email' ? 'LBL_EMAIL' : 'LBL_SMS');
    }

}
