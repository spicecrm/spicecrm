/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import {
    Component, Input, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';
import {loader} from '../../services/loader.service';
import {broadcast} from '../../services/broadcast.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'package-loader-language',
    templateUrl: './src/systemcomponents/templates/packageloaderlanguage.html',
})
export class PackageLoaderLanguage {

    @Input() private package: any;
    @Input() private repository: any;

    private loading: boolean = false;

    constructor(
        private language: language,
        protected backend: backend,
        private configurationService: configurationService,
        private loader: loader,
        private broadcast: broadcast
    ) {

    }

    get isDefault() {
        return this.package.language_code == this.language.getDefaultLanguage();
    }

    get deletedisabled() {
        return this.isDefault || this.package.language_code == this.language.currentlanguage;
    }
    get repositoryaddurl() {
        return this.repository && this.repository.id ? '/' + this.repository.id : '';
    }

    private setDefault() {
        if (!this.isDefault) {
            this.language.setDefaultLanguage(this.package.language_code);
        }
    }

    private loadLanguage(languagecode) {

        this.loading = true;
        this.backend.getRequest('packages/language/' + languagecode + this.repositoryaddurl).subscribe(response => {
            this.loading = false;
            if (response.success) {
                this.package.installed = true;
                this.language.addAvailableLanguage(response.languages[languagecode]);
                if (this.language.currentlanguage == languagecode) {
                    this.language.loadLanguage().subscribe((loaded) => {
                        this.package.installed = true;
                    });
                } else {
                    this.package.installed = true;
                }
            }
        });
    }

    private deleteLanguage(languagecode) {

        this.loading = true;
        this.backend.deleteRequest('packages/language/' + languagecode).subscribe(response => {
            this.loading = false;
            if (response) {
                this.package.installed = false;
                this.language.removeAvailableLanguage(languagecode);
            }
        });
    }
}
