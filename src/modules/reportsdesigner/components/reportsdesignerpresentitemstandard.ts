/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'reports-designer-present-item-standard',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemstandard.html'
})
export class ReportsDesignerPresentItemStandard implements OnInit {

    public propertiesFieldName: string = 'standardViewProperties';

    constructor(public language: language, public model: model) {
    }

    /**
     * @return listfields: object[]
     */
    get listFields() {
        return this.model.getField('listfields')
            .sort((a, b) => {
                if (!isNaN(parseInt(a.sortpriority, 10)) && !isNaN(parseInt(b.sortpriority, 10))) {
                    return +a.sortpriority > +b.sortpriority ? 1 : -1;
                } else {
                    return +a.sequence > +b.sequence ? 1 : -1;
                }
            });
    }

    /**
    * @return standardViewProperties: object
     */
    get properties() {
        return this.model.getField('presentation_params').pluginData[this.propertiesFieldName];
    }

    /**
    * @initializePluginData
     */
    public ngOnInit() {
        const properties = {
            processCount: 'Synchronous',
            listEntries: 25
        };
        this.initializePluginData(properties);
    }

    /**
    * @set standardViewProperties
    * @setField presentation_params
    */
    public initializePluginData(value: object) {
        const presentationParams = this.model.getField('presentation_params');
        if (!presentationParams.pluginData[this.propertiesFieldName]) {
            presentationParams.pluginData[this.propertiesFieldName] = value;
            this.model.setField('presentation_params', presentationParams);
        }
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    protected trackByFn(index, item) {
        return item.fieldid;
    }
}
