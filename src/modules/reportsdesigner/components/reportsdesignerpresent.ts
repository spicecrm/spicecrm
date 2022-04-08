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
    templateUrl: '../templates/reportsdesignerpresent.html'
})
export class ReportsDesignerPresent {

    public plugins: any[] = [];

    constructor(public language: language, public metadata: metadata, public model: model, public reportsDesignerService: ReportsDesignerService) {
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
    public initializePresentationParams(plugin?) {
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
    public trackByFn(index, item) {
        return item.id;
    }
}
