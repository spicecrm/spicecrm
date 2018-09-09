import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, Input
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {listfilters} from '../services/listfilters.service';

@Component({
    selector: '[object-listview-aggregate]',
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregate.html'
})
export class ObjectListViewAggregate {

    @Input() aggregate: any = {};
    setaggregates: any = {};

    constructor(private elementRef: ElementRef, private language: language, private metadata: metadata, private modellist: modellist, private model: model) {

    }

    isChecked(aggregate, aggregateData){
        return this.modellist.selectedAggregates.indexOf(aggregate+'::'+aggregateData) >= 0;
    }

    selectAggregate(aggregate, aggregateData){
        this.modellist.selectedAggregates.push(aggregate+'::'+aggregateData)
    }

}