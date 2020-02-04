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
    * initialize the persentation params and call loadPlugins
    */
    public ngOnInit() {
        this.initializePresentationParams();
        this.loadPlugins();
    }

    /**
    * load plugins from component set
    */
    private loadPlugins() {
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
                .sort((a, b) => !isNaN(parseInt(a.sequence, 10)) && !isNaN(parseInt(b.sequence, 10)) ? +a.sequence > +b.sequence ? 1 : -1 : 0);
        }
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
