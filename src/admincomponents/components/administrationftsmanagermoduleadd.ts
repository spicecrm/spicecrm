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
import {Component, EventEmitter, OnInit} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {fts} from "../../services/fts.service";

@Component({
    templateUrl: './src/admincomponents/templates/administrationftsmanagermoduleadd.html'
})
export class AdministrationFTSManagerModuleAdd implements OnInit {

    /**
     * reference to self
     */
    public self: any;

    /**
     * the modules that can be added
     */
    private modules: any[] = [];

    /**
     * the module selected
     */
    private module: string = '';

    /**
     * Event Emtitter for the selected module
     */
    public module$: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata,
                private language: language,
                private ftsconfiguration: ftsconfiguration) {
    }

    /**
     * initializes and diffs the modules from metadata with the ones that already hav an fts configuration
     */
    public ngOnInit(): void {
        let ftsModules = this.ftsconfiguration.modules;
        let allModules = this.metadata.getModules();

        for (let module of allModules) {
            if (ftsModules.indexOf(module) == -1) this.modules.push(module);
        }

        this.modules.sort();
    }

    /**
     * adds teh selected module
     */
    private add() {
        this.module$.emit(this.module);
        this.self.destroy();
    }

    /**
     * closes the modal
     */
    private close() {
        this.module$.emit(false);
        this.self.destroy();
    }

}

