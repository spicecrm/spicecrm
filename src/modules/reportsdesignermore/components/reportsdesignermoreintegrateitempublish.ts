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
 * @module ModuleReportsDesignerMore
 */
import {Component, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'reports-designer-more-integrate-item-target-list',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermoreintegrateitempublish.html',
})
export class ReportsDesignerMoreIntegrateItemPublish {

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private injector: Injector,
                private modal: modal) {
    }

    get canClearModule() {
        const whereConditions = this.model.getField('whereconditions');
        return !whereConditions || !whereConditions.some(condition => condition.operator == 'parent_assign');
    }

    /**
     * @return subPanelModule: object
     */
    get pluginSubpanelModule() {
        return {id: this.properties.subpanelModule, name: this.properties.subpanelModule};
    }

    /**
     * set the subpanelModule in plugin properties
     * @param value: object
     */
    set pluginSubpanelModule(value) {
        this.properties.subpanelModule = value.name;
    }

    /**
     * @return kpublishing: object
     */
    get properties() {
        return this.model.getField('integration_params').kpublishing;
    }

    /**
     * @return modules: string[]
     */
    get modules() {
        return this.metadata.getModules().sort().map(module => ({id: module, name: module}));
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
        let integrationParams = this.model.getField('integration_params');
        if (!integrationParams.kpublishing) {
            integrationParams.kpublishing = {
                dashletVisualization: 'off',
                dashletPresentation: 'off',
                subpanelVisualization: 'off',
                subpanelPresentation: 'off',
                subpanelModule: '',
                subpanelTab: '',
                subpanelSequence: 0
            };
            this.model.setField('integration_params', integrationParams);
        }
    }

    /**
     * set the field value from the string converted checkbox value
     * @param field: string
     * @param value: boolean
     */
    private setValue(field, value) {
        this.properties[field] = value ? 'on' : 'off';
    }

    /**
     * @param field: string
     * @return checkboxValue: boolean
     */
    private getCheckboxValue(field) {
        return this.properties[field] == 'on';
    }

    private searchModule() {
        this.modal.openModal('ReportsDesignerSelectModuleModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.response.subscribe(response => {
                    if (response) {
                        this.properties.subpanelModule = response.module;
                    }
                });
            });
    }

    private clearModule() {
        if (!this.canClearModule) return;
        this.properties.subpanelModule = '';
    }
}
