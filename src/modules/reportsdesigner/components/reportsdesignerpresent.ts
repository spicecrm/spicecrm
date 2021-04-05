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
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-present',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresent.html'
})
export class ReportsDesignerPresent {

    protected plugins: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model, private reportsDesignerService: ReportsDesignerService) {
    }

    /**
    * @return listtype: string
    */
    get selectedItemId() {
        return this.model.getField('listtype');
    }

    /**
     * set listtype field and initialize the presentation params
     * @param value: string
     */
    set selectedItemId(value) {
        this.model.setField('listtype', value);
        this.initializePresentationParams(value);

    }

    /**
    * initialize the presentation params and call loadPlugins
    */
    public ngOnInit() {
        this.initializePresentationParams();
        this.plugins = this.reportsDesignerService.loadPlugins('ReportsDesignerPresent');
    }

    /**
     * set the initial presentation params data
     * @param plugin?: string
     */
    private initializePresentationParams(plugin?) {
        let presentationParams = this.model.getField('presentation_params');
        if (!presentationParams || !presentationParams.plugin) {
            presentationParams = {
                plugin: 'standard',
                pluginData: {}
            };
        } else if (!!plugin && presentationParams.plugin != plugin) {
            presentationParams = {
                plugin: plugin,
                pluginData: {}
            };
        }
        this.model.setField('presentation_params', presentationParams);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return item.id;
    }
}
