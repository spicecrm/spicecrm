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
    templateUrl: '../templates/reportsdesignermoreintegrateitempublish.html',
})
export class ReportsDesignerMoreIntegrateItemPublish {

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public injector: Injector,
                public modal: modal) {
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
    public initializeProperties() {
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
    public setValue(field, value) {
        this.properties[field] = value ? 'on' : 'off';
    }

    /**
     * @param field: string
     * @return checkboxValue: boolean
     */
    public getCheckboxValue(field) {
        return this.properties[field] == 'on';
    }

    public searchModule() {
        this.modal.openModal('ReportsDesignerSelectModuleModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.response.subscribe(response => {
                    if (response) {
                        this.properties.subpanelModule = response.module;
                    }
                });
            });
    }

    public clearModule() {
        if (!this.canClearModule) return;
        this.properties.subpanelModule = '';
    }
}
