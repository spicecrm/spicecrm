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
 * @module ModuleTOTPAuthentication
 */
import {Component, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "totp-authentication-generate-modal",
    templateUrl: "./src/include/totpauthentication/templates/totpauthenticationgeneratemodal.html"
})
export class TOTPAuthenticationGenerateModal implements OnInit {

    /**
     * reference to the modal
     *
     * @private
     */
    private self: any;

    /**
     * the base 64 encoded QR code
     * @private
     */
    private QRCode: string;

    /**
     * the secret generated
     *
     * @private
     */
    private secret: string;

    private name: string;

    /**
     * the code entered to validate
     *
     * @private
     */
    private code: string = '';

    constructor(private language: language, private metadata: metadata, private modal: modal, private model: model, private backend: backend, private toast: toast) {

    }

    public ngOnInit() {
        let await = this.modal.await(this.language.getLabel('MSG_TOTP_GENERATING_CODE'));
        this.backend.getRequest(`authentication/totp/generate`).subscribe(
            res => {
                await.emit(true);
                if (res.secret) {
                    this.QRCode = 'data:image/png;base64,' + res.qrcode;
                    this.secret = res.secret;
                    this.name = res.name;
                } else {
                    this.toast.sendToast('Error generating Code', 'error');
                    this.close();
                }
            },
            () => {
                this.toast.sendToast('Error generating Code', 'error');
                this.close();
                await.emit(true);
            });
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

    private save() {
        this.backend.putRequest(`authentication/totp/validate/${this.code}`).subscribe(
            res => {
                if (res.validated) {
                    this.close();
                } else {
                    this.toast.sendToast('Error validating your code', 'warning', 'the code you entered is not valid, please try again', true);
                }
                this.code = '';
            },
            () => {
                this.toast.sendToast('Error validating your code', 'error', 'there as an internal error validating your request', true);
                this.code = '';
            }
        );
    }

}
