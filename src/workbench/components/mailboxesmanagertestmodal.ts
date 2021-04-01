/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        this.backend.postRequest("mailboxes/test", {}, {data: modelData, test_email: this.testemailaddress}).subscribe(
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
