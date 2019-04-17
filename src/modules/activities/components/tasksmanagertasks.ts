/**
 * @module ModuleActivities
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tasks-manager-tasks',
    templateUrl: './src/modules/activities/templates/tasksmanagertasks.html',
})
export class TasksManagerTasks {
    @ViewChild('taskscontent', {read: ViewContainerRef}) taskscontent: ViewContainerRef;
    @Output() taskselected: EventEmitter<string> = new EventEmitter<string>();
    focus: string = '';

    constructor(private language: language, private modellist: modellist) {

    }

    selectTask(id){
        this.focus = id;
        this.taskselected.emit(id);
    }


    onScroll(e) {
        let element = this.taskscontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }
}