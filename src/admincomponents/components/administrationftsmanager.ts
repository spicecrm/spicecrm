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
import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {modal} from "../../services/modal.service";


@Component({
    selector: '[administration-ftsmanager]',
    templateUrl: './src/admincomponents/templates/administrationftsmanager.html',
    providers: [ftsconfiguration]
})
export class AdministrationFTSManager {

    public activeTab: string = 'fields';
    public selected_module;

    constructor(
        private metadata: metadata,
        private language: language,
        private modal: modal,
        private ftsconfiguration: ftsconfiguration,
        private injector: Injector
    ) {

    }

    get modules() {
        // return this.metadata.getModules().sort();
        return this.ftsconfiguration.modules.sort();
    }

    get module() {
        return this.ftsconfiguration.module;
    }

    set module(module) {
        this.ftsconfiguration.setModule(module);
    }

    /**
     * adds a new fts module
     */
    private add() {
        this.modal.openModal('AdministrationFTSManagerModuleAdd', true, this.injector).subscribe(addPopup => {
            addPopup.instance.module$.subscribe(newModule => {
                if (newModule) {
                    this.module = newModule;
                }
            });
        });
    }

    /**
     * deletes the current FTS config settings
     */
    private delete() {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.ftsconfiguration.deleteModule(this.module);
                this.module = '';
            }
        });
    }

    public setActiveTab(tab) {
        this.activeTab = tab;
    }

    public save() {
        this.ftsconfiguration.save();
    }

    public indexModule() {
        this.modal.openModal('AdministrationFtsManagerIndexModal')
            .subscribe(modalRef => {
                modalRef.instance.response.subscribe(res => {
                    if (res) {
                        this.ftsconfiguration.executeAction('bulk', res);
                    }
                });
            });
    }

    public resetModule() {
        this.ftsconfiguration.executeAction('reset');
    }

    public initialize() {
        this.modal
            .confirm('Are you sure you want to initialize your FTS? It recreates new indices, so indexed data will be lost and have to be rebuild!', 'Initialize')
            .subscribe(res => {
                if (res) {
                    this.ftsconfiguration.executeAction('init');
                }
            });
    }

}

