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
 * @module ModuleGroupware
 */
import {Component, ChangeDetectorRef} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {language} from '../../../services/language.service';
import {configurationService} from "../../../services/configuration.service";

/**
 * A list of attachments for the current email.
 */
@Component({
    selector: 'groupware-email-archive-pane-attachments',
    templateUrl: './src/include/groupware/templates/groupwareemailarchivepaneattachments.html'
})
export class GroupwareEmailArchivePaneAttachments {

    constructor(
        private groupware: GroupwareService,
        private changeDetectorRef: ChangeDetectorRef,
        private configurationService: configurationService
    ) {
        this.loadAttachments();
    }

    /**
     * select/deselect all attachments based on the checkbox boolean value
     * @param val
     */
    set selectAll(val) {
        if (val) {
            this.groupware.archiveattachments = this.attachments.slice();
        } else {
            this.groupware.archiveattachments = [];
        }
    }

    /**
     * @return true if all attachments are selected
     */
    get selectAll() {
        return this.groupware.archiveattachments.length > 0 && this.groupware.archiveattachments.length == this.attachments.length;
    }

    /**
     * List of attachments.
     */
    get attachments() {
        return this.groupware.attachments.attachments;
    }

    /**
     * Loads a list of the attachments.
     */
    public loadAttachments() {
        this.groupware.getAttachments().subscribe(
            (res: any) => {
                // todo get a list of the already selected attachments
                const checkAll = this.configurationService.getCapabilityConfig('emails').check_all_attachments_on_archive;
                if (!!checkAll) {
                    this.groupware.archiveattachments = this.attachments.slice();
                }
                this.changeDetectorRef.detectChanges();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
