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
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-integrate',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrate.html'
})
export class ReportsDesignerIntegrate {

    protected plugins: any[] = [];
    private selectedItemId: string = '';

    constructor(private language: language, private metadata: metadata, private model: model, private reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return activePlugins: object
     */
    get activePlugins() {
        return this.model.getField('integration_params').activePlugins;
    }

    /**
    * load plugins from component set and initialize the integration params
    */
    public ngOnInit() {
        this.plugins = this.reportsDesignerService.loadPlugins('ReportsDesignerIntegrate');
        this.initializeIntegrationParams();
    }

    /**
     * set the initial integration params data
     * @param plugin?: string
     */
    private initializeIntegrationParams(plugin?) {
        let integrationParams = this.model.getField('integration_params');
        if (!integrationParams) integrationParams = {};
        if (!integrationParams.activePlugins) {
            integrationParams.activePlugins = {};
            this.model.setField('integration_params', integrationParams);
        }
    }

    /**
    * @param itemId: string
    * @set selectedItemId
    */
    private setSelectedItemId(itemId) {
        this.selectedItemId = itemId;
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

    /**
     * set activePlugins in integration params
     * @param plugin: string
     * @param bool: boolean
     */
    private setActivePlugins(plugin, bool) {
        const integrationParams = this.model.getField('integration_params');
        integrationParams.activePlugins[plugin] = bool ? 1 : 0;
        this.model.setField('integration_params', integrationParams);
    }
}
