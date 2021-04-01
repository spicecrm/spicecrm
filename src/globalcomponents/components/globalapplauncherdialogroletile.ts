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
 * @module GlobalComponents
 */
import {Component, ElementRef, ViewChild, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-app-launcher-dialog-role-tile',
    templateUrl: './src/globalcomponents/templates/globalapplauncherdialogroletile.html'
})
export class GlobalAppLauncherDialogRoleTile implements OnInit {

    @Input() private role;

    private name: string;
    private identifier: string;
    private description: string;
    private descriptionfull: string;

    constructor(
        private language: language,
        private metadata: metadata,
    ) {

    }

    public ngOnInit() {
        this.buildRoleLabels();
    }

    private buildRoleLabels() {
        this.metadata.getRoles().some((role) => {
            if (role.id == this.role.id) {
                this.identifier = this.language.getAppLanglabel(role.label, 'short');
                this.name = this.language.getAppLanglabel(role.label);
                this.description = this.language.getAppLanglabel(role.label, 'long');
                if ( this.name === this.description ) this.description = null; // Don´t output the same string twice.

                if (this.description && this.description.length > 75) {
                    this.descriptionfull = this.description;
                    this.description = this.description.substr(0, 75) + '...';
                }
                return true;
            }
        });
    }

}
