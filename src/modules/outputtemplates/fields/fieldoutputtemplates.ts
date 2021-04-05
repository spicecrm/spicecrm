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
 * @module ObjectFields
 */
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from '../../../services/configuration.service';
import {backend} from "../../../services/backend.service";

import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";


@Component({
    selector: 'field-output-templates',
    templateUrl: './src/modules/outputtemplates/templates/fieldoutputtemplates.html'
})
export class fieldOutputTemplates extends fieldGeneric implements OnInit {

    /**
     * set to true if the templates are loaded
     */
    private isLoaded: boolean = false;

    /**
     * the templates loaded and presernted in the enum
     */
    private items = [];


    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private configuration: configurationService
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * disable the field if it is not loaded or no items have been found
     */
    get isDisabled() {
        return !this.isLoaded || !this.items;
    }

    /**
     * returns the template matching the id
     */
    get selected_item() {
        return this.items.find(item => item.id == this.value);
    }

    /**
     * loads the output templates either from the configuration service if they are loaded already or from the backend
     */
    public ngOnInit() {
        let outPutTemplates = this.configuration.getData('OutputTemplates');
        if (outPutTemplates && outPutTemplates[this.model.module]) {
            this.items = outPutTemplates[this.model.module];
            this.isLoaded = true;
        } else {
            this.backend.getRequest('module/OutputTemplates/formodule/' + this.model.module, {}).subscribe(
                (data: any) => {
                    // set the templates
                    this.configuration.setData('OutputTemplates', data);

                    // set the templates internally
                    this.items = data;

                    this.isLoaded = true;
                }
            );
        }
    }
}
