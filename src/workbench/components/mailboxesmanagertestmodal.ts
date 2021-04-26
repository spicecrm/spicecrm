/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, OnInit} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {session} from "../../services/session.service";

@Component({
    templateUrl: "./src/workbench/templates/mailboxesmanagertestmodal.html",
})
export class MailboxesmanagerTestModal implements OnInit {

    /**
     * reference to self
     */
    public self: any = {};

    /**
     * set to true when the test succeeds
     */
    private validConnection: boolean = false;

    /**
     * event emiter when the modal closes with the test status
     */
    public isvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the tgest email address, in on init defaulted to the users email
     */
    private testemailaddress: string = "";

    /**
     * indicates that the test is running
     */
    private testing: boolean = false;

    /**
     * indicates that the test has been done
     */
    private tested: boolean = false;

    /**
     * the type of test .. sms or email
     * differemntiates the header label and the defualt value
     */
    public testtype: 'email' | 'sms' = 'email';

    constructor(
        private backend: backend,
        private language: language,
        private model: model,
        private session: session
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
        this.backend.postRequest("module/Mailboxes/test", {}, {data: modelData, test_email: this.testemailaddress}).subscribe(
            (response: any) => {
                if (response.result === true) {
                    this.validConnection = true;
                } else {
                    this.validConnection = false;
                }

                this.tested = true;
                this.testing = false;
            },
            (err: any) => {
                this.tested = false;
                this.testing = false;
                this.validConnection = false;
            });
    }

    /**
     * closes the modal and emits the result
     */
    private close() {
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
