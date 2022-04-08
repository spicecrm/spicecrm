/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {modelutilities} from "../../../services/modelutilities.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

@Component({
    selector: '[reports-designer-manipulate-table-row-expansion]',
    templateUrl: '../templates/reportsdesignermanipulatetablerowexpansion.html'
})
export class ReportsDesignerManipulateTableRowExpansion {

    /**
    * @input listItem: any
    */
    @Input() public listItem: any = {};

    constructor(public language: language,
                public modelUtilities: modelutilities,
                public modal: modal,
                public model: model,
                public reportsDesignerService: ReportsDesignerService) {
    }
}
