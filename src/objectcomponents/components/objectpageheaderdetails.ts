/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Input, OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ActivatedRoute, Router}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-page-header-details',
    templateUrl: './app/objectcomponents/templates/objectpageheaderdetails.html',

})
export class ObjectPageHeaderDetails implements OnInit{
    componentconfig: any = {};

    constructor(private elementref: ElementRef, private activatedRoute: ActivatedRoute, private router: Router, private model: model, private metadata: metadata) {

    }

    ngOnInit(){
        if(JSON.stringify(this.componentconfig) == '{}')
            this.componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.model.module);
    }

    get fieldSets(){
        return this.componentconfig && this.componentconfig.fieldset ? [this.componentconfig.fieldset] : [];
    }

    get collapsed(){
        return this.componentconfig.collapsed ? this.componentconfig.collapsed : false;
    }

}