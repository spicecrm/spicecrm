/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-present',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresent.html'
})
export class ReportsDesignerPresent {

    protected items: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model) {
    }

    /*
    * @return listtype: string
    */
    get selectedItemId() {
        return this.model.getField('listtype');
    }

    /*
    * @param value: string
    * @setField listtype
    */
    set selectedItemId(value) {
        this.model.setField('listtype', value);
        this.initializePresentationParams(value);

    }

    /*
    * @loadItems
    */
    public ngOnInit() {
        this.initializePresentationParams();
        this.loadItems();
    }

    /*
    * @set items from metadata.getComponentSetObjects
    */
    private loadItems() {
        const conf = this.metadata.getComponentConfig('ReportsDesignerPresent', 'KReports');
        if (conf.componentset && conf.componentset.length > 0) {
            const items = this.metadata.getComponentSetObjects(conf.componentset);
            if (!items || items.length == 0) return;
            this.items = items
                .filter(item => !!item.componentconfig)
                .map(item => ({
                    name: this.language.getLabel(item.componentconfig.name),
                    id: item.componentconfig.plugin,
                    component: item.componentconfig.component,
                    sequence: item.sequence
                }))
                .sort((a, b) => +a.sequence > +b.sequence ? 1 : -1);
        }
    }

    /*
    * @define presentationParams
    * @set presentationParams.plugin
    * @setField presentation_params
    */
    private initializePresentationParams(plugin?) {
        let presentationParams = this.model.getField('presentation_params');
        if (!presentationParams || !presentationParams.plugin) {
            presentationParams = {
                plugin: 'standard',
                pluginData: {}
            };
        } else if (presentationParams.plugin != plugin) {
            presentationParams = {
                plugin: plugin,
                pluginData: {}
            };
        }
        this.model.setField('presentation_params', presentationParams);
    }
}
