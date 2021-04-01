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
 * @module ObjectComponents
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'service-docs-signature-content',
    templateUrl: './src/modules/servicecomponents/templates/servicedocsignaturecontent.html',
    providers: [view]
})
export class ServiceDocSignatureContent {

    /**
     * the fieldset
     */
    @Input() public fieldset: any = null;

    /**
     * the parent model
     */
    @Input() public parent: any = {};

    /**
     * email sent
     */
    @Output() public rendertemplate: EventEmitter<string> = new EventEmitter<string>();

    /**
     * inidcates that we are sending
     */
    private sending: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private modal: modal,
        private view: view,
        private session: session
    ) {
    }

    public ngOnInit() {
        this.setViewData();
    }

    /**
     * if it is allowed: go to edit mode
     */
    private setViewData() {
        this.view.setEditMode();
        this.view.isEditable = true;
    }

    /**
     * Save the parent model and reload template
     */
    public saveSignature() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';
            this.parent.save().subscribe(
                success => {

                    modalRef.instance.self.destroy();
                    // emit that the PDF should be rendered new
                    this.rendertemplate.emit();
                },
                error => {
                    modalRef.instance.self.destroy();
                    this.sending = false;
                }
            );
        });
    }
}
