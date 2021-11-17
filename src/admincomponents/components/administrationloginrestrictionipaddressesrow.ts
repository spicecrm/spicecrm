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
 * @module AdminComponentsModule
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { take } from 'rxjs/operators';
import { language } from '../../services/language.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: '[administration-login-restriction-ip-addresses-row]',
    templateUrl: './src/admincomponents/templates/administrationloginrestrictionipaddressesrow.html'
})
export class AdministrationLoginRestrictionIpAddressesRow {

    @Input() private ipAddress: any;
    @Output() private editing = new EventEmitter<boolean>();
    @Input() private otherEditing: boolean;

    private isEditing = false;
    private backup: string;

    constructor(private backend: backend, private toast: toast, private language: language ) { }

    private editDescription() {
        this.backup = this.ipAddress.description;
        this.isEditing = true;
        this.editing.emit(true);
    }

    private save() {
        this.isEditing = false;
        this.backend.putRequest('authentication/ipAddress/'+this.ipAddress.address, null, { description: this.ipAddress.description })
            .pipe(take(1))
            .subscribe( response => {
                this.isEditing = false;
                this.editing.emit(false);
            },
        error => {
                this.ipAddress.description = this.backup;
                this.isEditing = false;
                this.editing.emit(false);
                this.toast.sendToast('Error saving Description of IP Address.','error');
            });
    }

    private cancel() {
        this.isEditing = false;
        this.editing.emit(false);
        this.ipAddress.description = this.backup;
    }

}
