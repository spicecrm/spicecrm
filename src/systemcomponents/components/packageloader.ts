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
 * @module SystemComponents
 */
import {
    Component, Pipe
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'package-loader',
    templateUrl: './src/systemcomponents/templates/packageloader.html',
})
export class PackageLoader {

    private scope: string = 'essentials';
    private loading: boolean = true;
    private packagefilterterm: string = '';

    protected repositories = [];
    protected repository: any;
    protected packages = [];
    protected versions = [];
    protected languages = [];
    protected opencrs: boolean = false;
    private errorpackages: string[] = [];

    constructor(
        private language: language,
        protected backend: backend,
        private toast: toast,
        private metadata: metadata
    ) {

        this.backend.getRequest('configuration/packages/repositories').subscribe(
            (res) => {
                this.loading = false;
                this.repositories = res;

                if (this.repositories.length == 0) {
                    this.repository = 'default';
                    this.loadpackages();
                } else if (this.repositories.length == 1) {
                    this.repository = this.repositories[0];
                    this.loadpackages();
                }
            },
            (err) => {
                this.loading = false;
            },
        );
    }


    get errorpackagesdisplay() {
        return this.errorpackages.join(', ');
    }

    get repositoryname() {
        return this.repository && this.repository.name ? this.repository.name : '';
    }
    get repositoryaddurl() {
        return this.repository && this.repository.id ? '/' + this.repository.id : '';
    }

    private loadpackages() {
        this.loading = true;

        this.packages = [];
        this.languages = [];
        this.opencrs = false;
        this.errorpackages = [];

        this.backend.getRequest('configuration/packages' + this.repositoryaddurl).subscribe(
            (res) => {
                this.loading = false;
                try {
                    let availableLanguages = this.language.getAvialableLanguages(true);
                    for (let langpack of res.languages) {
                        availableLanguages.some(thislanguage => {
                            if (thislanguage.language == langpack.language_code) {
                                langpack.installed = true;
                                return true;
                            }
                        })
                        this.languages.push(langpack);
                    }

                    for (let confpackage of res.packages) {
                        let instIndex = res.loaded.packages.indexOf(confpackage.package);
                        if (instIndex >= 0) {
                            confpackage.installed = true;
                            res.loaded.packages.splice(instIndex, 1);
                        } else {
                            confpackage.installed = false;
                        }
                        this.packages.push(confpackage);
                    }
                    this.versions = res.versions;
                    this.opencrs = res.opencrs;

                    // write the erroneous packages
                    this.errorpackages = res.loaded.packages;

                } catch (e) {
                    console.error(e);
                }
            },
            (err) => {
                this.loading = false;
            },
        );
    }

    private selectRepository(repository) {
        this.repository = repository;
        this.loadpackages();
    }


}
