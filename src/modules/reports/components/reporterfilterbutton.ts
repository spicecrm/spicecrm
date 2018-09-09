import { Component, Input, OnInit, OnChanges, OnDestroy, Renderer2, ElementRef, ViewChild, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { language } from '../../../services/language.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-button',
    templateUrl: './src/modules/reports/templates/reporterfilterbutton.html'
})
export class ReporterFilterButton implements OnChanges, OnDestroy{

    @ViewChild('actionitems', {read: ViewContainerRef}) actionitems: ViewContainerRef;

    @Input() whereConditions: any = {};
    hasUserFilters: boolean = false;
    showFilters: boolean = false;
    @Output() filter: EventEmitter<any> = new EventEmitter<any>();

    constructor( private language: language, private reporterconfig: reporterconfig) {
    }

    ngOnChanges(){
        for (let whereCondition of this.whereConditions) {
            if (whereCondition.usereditable == 'yes') {
                this.reporterconfig.addUserFilter(whereCondition);
                this.hasUserFilters = true;
            }
        }
    }

    ngOnDestroy(){

    }

    toggleFilters(){
        this.showFilters = !this.showFilters;
        this.filter.emit(this.showFilters);
    }

}