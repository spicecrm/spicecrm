import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tasks-manager-header',
    templateUrl: './app/modules/activities/templates/tasksmanagerheader.html',
})
export class TasksManagerHeader {
    constructor(private language: language, private elementRef: ElementRef) {

    }

}