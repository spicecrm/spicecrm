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
import { Component, OnInit } from '@angular/core';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';
import { take } from 'rxjs/operators';
import { language } from '../../services/language.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'administration-password-config',
    templateUrl: './src/admincomponents/templates/administrationpasswordconfig.html'
})
export class AdministrationPasswordConfig implements OnInit {

    /**
     * inidcates that we are loading
     * @private
     */
    private isLoading = true;

    private config = {
        minpwdlength: 6,
        oneupper: true,
        onelower: true,
        onenumber: true,
        onespecial: true,
        pwdvaliditydays: 0
    };

    private configBackup: any;

    constructor( private backend: backend, private modal: modal, private toast: toast, private language: language ) { }

    private configIsDirty() {
        return !_.isEqual( this.config, this.configBackup );
    }

    private cancel() {
        this.config = JSON.parse(JSON.stringify( this.configBackup ));
    }

    private save() {
        let config = {
            minpwdlength: this.config.minpwdlength,
            oneupper: this.config.oneupper ? '1':'0',
            onelower: this.config.onelower ? '1':'0',
            onenumber: this.config.onenumber ? '1':'0',
            onespecial: this.config.onespecial ? '1':'0',
            pwdvaliditydays: this.config.pwdvaliditydays
        };
        this.isLoading = true;
        this.backend.postRequest('configuration/configurator/editor/passwordsetting', null, { config: config })
            .pipe(take(1))
            .subscribe( response => {
                this.configBackup = JSON.parse(JSON.stringify( this.config ));
                this.toast.sendToast( 'Password Configuration successfully saved.', 'success' );
                this.isLoading = false;
            });
    }

    public ngOnInit() {
        this.loadConfig();
    }

    private loadConfig() {
        this.isLoading = true;
        this.backend.getRequest('configuration/configurator/editor/passwordsetting')
            .pipe(take(1))
            .subscribe(response => {
                this.config.oneupper = response.oneupper === true || response.oneupper === 1 || response.oneupper === '1' || false;
                this.config.onelower = response.onelower === true || response.onelower === 1 || response.onelower === '1' || false;
                this.config.onenumber = response.onenumber === true || response.onenumber === 1 || response.onenumber === '1' || false;
                this.config.onespecial = response.onespecial === true || response.onespecial === 1 || response.onespecial === '1' || false;
                this.config.minpwdlength = parseInt( response.minpwdlength, 10 ) || 0,
                this.config.pwdvaliditydays = parseInt( response.pwdvaliditydays, 10 ) || 0,
                this.configBackup = JSON.parse( JSON.stringify( this.config ) );
                this.isLoading = false;
            });
    }

}
