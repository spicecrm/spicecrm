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
import {AfterViewInit, Component, Input, SkipSelf, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-integrate-item-target-list',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrateitemtargetlist.html',
    providers: [model]
})
export class ReportsDesignerIntegrateItemTargetList {

    constructor(private language: language, @SkipSelf() private model: model, private prospectListModel: model) {
    }

    /**
     * @return ktargetlistexport: object
     */
    get properties() {
        return this.model.getField('integration_params').ktargetlistexport;
    }

    /**
     * set the properties.targetlist_id and the model data
     * @param value: string
     */
    set targetList(value) {
        if (!value) return;
        const valueArray = value.split('::');
        this.prospectListModel.id = valueArray[0];
        this.prospectListModel.resetData();
        this.prospectListModel.setField('name', valueArray[1]);

        const properties = this.properties;
        properties.targetlist_id = this.prospectListModel.id;
    }

    /**
     * @return targetList: string
     */
    get targetList() {
        return !!this.prospectListModel.data.name ? `${this.prospectListModel.id}::${this.prospectListModel.data.name}` : '';
    }

    /**
     * initialize the plugin properties
     */
    public ngOnInit() {
        this.initializeProperties();
    }

    /**
     * set the initial plugin properties
     */
    private initializeProperties() {
        this.prospectListModel.module = 'ProspectLists';

        let integrationParams = this.model.getField('integration_params');
        if (!integrationParams.ktargetlistexport) {
            integrationParams.ktargetlistexport = {
                targetlist_id: '',
                targetlist_update_action: '',
                targetlist_create_direct: false
            };
            this.model.setField('integration_params', integrationParams);
        } else if (!!integrationParams.ktargetlistexport.targetlist_id) {
            this.prospectListModel.id = integrationParams.ktargetlistexport.targetlist_id;
            this.prospectListModel.getData();
        }
    }
}
