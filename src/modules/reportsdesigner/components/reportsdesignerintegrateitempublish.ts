/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, Input, SkipSelf, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'reports-designer-integrate-item-target-list',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrateitempublish.html',
})
export class ReportsDesignerIntegrateItemPublish {

    constructor(private language: language, private model: model, private metadata: metadata, private modal: modal) {
    }

    /**
     * set the subpanelModule in plugin properties
     * @param value: object
     */
    set pluginSubpanelModule(value) {
        this.properties.subpanelModule = value.name;
    }

    /**
     * @return subPanelModule: object
     */
    get pluginSubpanelModule() {
        return {id: this.properties.subpanelModule, name: this.properties.subpanelModule};
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
        this.modal.openModal('ReportsDesignerSelectModuleModal')
            .subscribe(modalRef => {
                modalRef.instance.response.subscribe(response => {
                    if (response) {
                        this.properties.subpanelModule = response.module;
                    }
                });
            });
    }

    private clearModule() {
        this.properties.subpanelModule = '';
    }
}
