import {Component, Input, ViewChild, ViewContainerRef, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-filter-panel-filter-bool',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfilterbool.html'
})
export class ObjectListViewFilterPanelFilterBool implements OnInit{
    @Input() filter: any = {};

    constructor( private elementRef: ElementRef, private metadata: metadata, private language: language, private model: model) {

    }

    ngOnInit(){
        this.filter.operator = 'equals';
    }

    valueDisabled(){
        return this.filter.field ? false : true;
    }
}
