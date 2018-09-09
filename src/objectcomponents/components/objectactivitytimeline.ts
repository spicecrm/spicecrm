import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    Input, OnInit, OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline',
    templateUrl: './app/objectcomponents/templates/objectactivitiytimeline.html',
    providers: [activitiyTimeLineService]
})
export class ObjectActivitiyTimeline implements OnInit, OnDestroy{

    @Input() parentModule: string = '';
    @Input() parentId: string = '';
    componentconfig: any = {};

    displayAddContainer: boolean = false;

    constructor(private model: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit(){
        this.parentModule = this.model.module;
        this.parentId = this.model.id;

        this.activitiyTimeLineService.parent = this.model;

        if(!this.componentconfig.hideaddcontainer){
            this.displayAddContainer = true;
        }

    }

    ngOnDestroy(){
        this.activitiyTimeLineService.stopSubscriptions();
    }

    reload(){
        this.activitiyTimeLineService.getTimeLineData('Activities');
        this.activitiyTimeLineService.getTimeLineData('History');
    }

    loadMore(module){
        this.activitiyTimeLineService.getMoreTimeLineData(module, 5);
    }

}