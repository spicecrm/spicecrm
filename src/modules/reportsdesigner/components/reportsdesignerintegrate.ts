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
    templateUrl: '../templates/reportsdesignerintegrate.html'
})
export class ReportsDesignerIntegrate {

    public plugins: any[] = [];
    public selectedItemId: string = '';

    constructor(public language: language, public metadata: metadata, public model: model, public reportsDesignerService: ReportsDesignerService) {
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
    public initializeIntegrationParams(plugin?) {
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
    public setSelectedItemId(itemId) {
        this.selectedItemId = itemId;
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * set activePlugins in integration params
     * @param plugin: string
     * @param bool: boolean
     */
    public setActivePlugins(plugin, bool) {
        const integrationParams = this.model.getField('integration_params');
        integrationParams.activePlugins[plugin] = bool ? 1 : 0;
        this.model.setField('integration_params', integrationParams);
    }
}
