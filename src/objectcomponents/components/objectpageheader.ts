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
import {language} from '../../services/language.service';

@Component({
    selector: 'object-page-header',
    templateUrl: './app/objectcomponents/templates/objectpageheader.html',
    providers: [view]
})
export class ObjectPageHeader implements OnInit{

    //fieldSets: any = [];
    componentconfig: any = {};
    actionSet: string = '';
    //topscroll: number = 0;

    get moduleName(){
        return this.model.module;
    }

    constructor(private language: language, private elementref: ElementRef, private activatedRoute: ActivatedRoute, private router: Router, private model: model, private metadata: metadata) {

    }

    ngOnInit(){
        // get the Componentconfig if not set yet
        let componentconfig = this.componentconfig && JSON.stringify(this.componentconfig) !== JSON.stringify({}) ? this.componentconfig : this.metadata.getComponentConfig('ObjectPageHeader', this.model.module);

        this.actionSet = componentconfig.actionset;
    }

    goToModule(){
        this.router.navigate(['/module/' + this.moduleName ]);
    }

}