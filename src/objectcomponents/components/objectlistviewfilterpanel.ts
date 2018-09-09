/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, Renderer2
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {listfilters} from '../services/listfilters.service';

@Component({
    selector: 'object-listview-filter-panel',
    templateUrl: './app/objectcomponents/templates/objectlistviewfilterpanel.html',
    providers: [listfilters]
})
export class ObjectListViewFilterPanel {

    constructor(private elementRef: ElementRef, private listfilters: listfilters, private language: language, private metadata: metadata, private modellist: modellist, private model: model, private renderer: Renderer2) {
        this.setBaseFilter();
        this.modellist.listtype$.subscribe(newlist => this.setBaseFilter());
    }

    setBaseFilter(){
        this.listfilters.basefilter = this.modellist.getBaseFilter();
        this.listfilters.loadedBasefilter = this.modellist.getBaseFilter();

        this.listfilters.filters = this.modellist.getFilterDefs();
        this.listfilters.loadedFilters = this.modellist.getFilterDefs();
    }

    isChanged(){
        return this.listfilters.isDirty();
    }

    save(){
        this.modellist.updateListType({basefilter: this.listfilters.basefilter, filterdefs: btoa(JSON.stringify(this.listfilters.filters))}).subscribe(retval => {
            this.listfilters.loadedBasefilter = this.modellist.getBaseFilter();
            this.listfilters.loadedFilters = this.modellist.getFilterDefs();
        });
    }
    cancel(){
        this.listfilters.basefilter = this.modellist.getBaseFilter();
        this.listfilters.filters = this.modellist.getFilterDefs();
    }

    addFilter(){
        this.listfilters.filters.push({
            id: this.model.generateGuid(),
            field: '',
            operator: '',
            filtervalue: ''
        })
    }

    removeAllFilters(){
        this.listfilters.filters = [];
    }

    getPanelStyle(){
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top +'px)'
        }
    }
}