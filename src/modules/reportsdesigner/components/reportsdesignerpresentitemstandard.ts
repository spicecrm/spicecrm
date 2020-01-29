/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemstandard.html'
})
export class ReportsDesignerPresentItemStandard implements OnInit {

    constructor(private language: language, private model: model) {
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
                     +a.sequence > +b.sequence ? 1 : -1;
                 }
            });
    }

    /**
    * @return standardViewProperties: object
     */
    get standardViewProperties() {
        return this.model.getField('presentation_params').pluginData.standardViewProperties;
    }

    /**
    * @initializePluginData
     */
    public ngOnInit() {
        this.initializePluginData();
    }

    /**
    * @set standardViewProperties
    * @setField presentation_params
    */
    private initializePluginData() {
        const presentationParams = this.model.getField('presentation_params');
        if (!presentationParams.pluginData.standardViewProperties) {
            presentationParams.pluginData.standardViewProperties = {
                processCount: 'Synchronous',
                listEntries: 25
            };
            this.model.setField('presentation_params', presentationParams);
        }
    }

    /**
    * @set field.link: string
     */
    protected setFieldLink(field, value) {
        field.link = value ? 'yes' : 'no';
    }

    /**
    * @moveItemInArray item in group.conditions
     * @set listfield.sortpriority
     * @set listfields
     */
    private onDrop(dragEvent: CdkDragDrop<any>) {
        moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        dragEvent.container.data = dragEvent.container.data.map((item, index) => {
            item.sortpriority = index;
            return item;
        });
        this.model.setField('listfields', dragEvent.container.data);
    }

    /**
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.fieldid;
    }
}
