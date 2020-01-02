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
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignermanipulatetablerowexpansion.html'
})
export class ReportsDesignerManipulateTableRowExpansion {

    /*
    * @input listItem: any
    */
    @Input() private listItem: any = {};

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
    }
}
