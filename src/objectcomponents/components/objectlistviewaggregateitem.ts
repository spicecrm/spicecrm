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
    selector: '[object-listview-aggregate-item]',
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregateitem.html'
})
export class ObjectListViewAggregateItem {

    @Input() bucketitem: any = {};
    @Input() aggregate: string = '';
    isChecked: boolean = false;

    constructor(private elementRef: ElementRef, private language: language, private metadata: metadata, private modellist: modellist, private model: model) {

    }

    set checked(value){
        this.isChecked = value;
        if(value)
            this.modellist.setAggregate(this.aggregate, this.bucketitem.aggdata);
        else
            this.modellist.removeAggregate(this.aggregate, this.bucketitem.aggdata);
    }

    get checked(){
        return this.modellist.checkAggregate(this.aggregate, this.bucketitem.aggdata);
    }

}