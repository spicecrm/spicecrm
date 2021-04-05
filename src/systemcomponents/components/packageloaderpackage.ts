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
    selector: 'package-loader-package',
    templateUrl: './src/systemcomponents/templates/packageloaderpackage.html',
})
export class PackageLoaderPackage implements OnInit {

    @Input() private package: any;
    @Input() private packages: any[] = [];
    @Input() private repository: any;
    private extensions: any[] = [];
    private requiredpackages: any[] = [];
    // private disabled: boolean = true;
    private loading: string = '';

    constructor(
        private language: language,
        protected backend: backend,
        private configurationService: configurationService,
        private loader: loader,
        private broadcast: broadcast
    ) {

    }

    get disabled() {
        // if the package is installed we show it as enabled ... so it can at least be unlaoded
        if (this.package.package.installed) return false;

        // if package is not installed check for prerequsites
        let disabled = false;
        this.extensions.forEach(extension => {
            if (!extension.status) disabled = true;
        });
        this.requiredpackages.forEach(pkg => {
            if (!pkg.installed) disabled = true;
        });

        return disabled;
    }

    get repositoryaddurl() {
        return this.repository && this.repository.id ? '/' + this.repository.id : '';
    }

    public ngOnInit() {
        let disabled = false;
        if (this.package.extensions) {
            for (let extension of this.package.extensions.split(',')) {
                let extensionstatus = this.configurationService.checkCapability(extension);
                this.extensions.push({
                    name: extension,
                    status: extensionstatus
                });
            }
        }
        if (this.package.packages) {
            this.requiredpackages = this.packages.filter(pkg => this.package.packages.split(',').indexOf(pkg.package) >= 0);
        }
    }

    private loadPackage(packagename) {
        this.loading = 'package';
        this.backend.getRequest('packages/package/' + packagename + this.repositoryaddurl).subscribe(
            response => {
                this.loading = 'configuration';
                this.loader.reloadPrimary().subscribe(status => {
                    this.package.installed = true;
                    this.broadcast.broadcastMessage('loader.reloaded');
                    this.loading = '';
                });
            },
            error => {
                this.loading = '';
            });
    }

    private deletePackage(packagename) {
        this.loading = 'package';
        this.backend.deleteRequest('packages/package/' + packagename).subscribe(response => {
            this.loading = 'configuration';
            this.package.installed = false;
            this.loader.reloadPrimary().subscribe(status => {
                this.broadcast.broadcastMessage('loader.reloaded');
                this.loading = '';
            });
        });
    }
}
