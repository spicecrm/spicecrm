/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef, EventEmitter,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import { fts } from '../../services/fts.service';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';
import { popup } from '../../services/popup.service';
import { Router } from '@angular/router';

@Component({
    selector: '[global-header-search-results-item]',
    templateUrl: './app/globalcomponents/templates/globalheadersearchresultsitem.html',
    providers: [model],
    host: {
        "(click)": "navigateTo()"
    }
})
export class GlobalHeaderSearchResultsItem implements OnInit{
    @Input() hit: any = {};

    constructor(private model: model, private router: Router, private popup: popup, private language : language){

    }

    navigateTo(){
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
        this.popup.close();
    }

    gethref(){
        return '#/module/' + this.model.module + '/' + this.model.id;
    }

    ngOnInit(){
        this.model.module = this.hit._type;
        this.model.id = this.hit._id;
        for(let field in this.hit._source){
            this.model.data[field] = this.hit._source[field];
        }
    }
}