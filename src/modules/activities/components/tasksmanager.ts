/**
 * @module ModuleActivities
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    // selector: 'object-home',
    templateUrl: './src/modules/activities/templates/tasksmanager.html',
})
export class TasksManager {

    @ViewChild('tasksmanagercontent', {read: ViewContainerRef, static: true}) tasksmanagercontent: ViewContainerRef;

    constructor(private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private model: model, private modellist: modellist) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Tasks');

        this.model.module = 'Tasks';
        this.modellist.setModule('Tasks');


    }

    get contentStyle(){
        let rect = this.tasksmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px'
        }
    }

}