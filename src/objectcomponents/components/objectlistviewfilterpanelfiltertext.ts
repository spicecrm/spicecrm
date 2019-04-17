/**
 * @module ObjectComponents
 */
import {Component, Input, ElementRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-filter-panel-filter-text',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfiltertext.html'
})
export class ObjectListViewFilterPanelFilterText{
    @Input() filter: any = {};

    operators: Array<any> = [
            {
                operator: 'equals',
                name: 'LBL_EQUALS'
            },{
                operator: 'starts',
                name: 'LBL_STARTS'
            },{
                operator: 'contains',
                name: 'LBL_CONTAINS'
            },{
                operator: 'ncontains',
                name: 'LBL_NCONTAINS'
            },{
                operator: 'greater',
                name: 'LBL_GREATER'
            },{
                operator: 'gequal',
                name: 'LBL_GEQUAL'
            },{
                operator: 'smaller',
                name: 'LBL_SMALLER'
            },{
                operator: 'sequal',
                name: 'LBL_SEQUAL'
            }
        ];


    constructor( private elementRef: ElementRef, private metadata: metadata, private language: language, private model: model) {

    }

    operatorDisabled(){
        return this.filter.field ? false : true;
    }


    valueDisabled(){
        return this.filter.operator ? false : true;
    }
}
