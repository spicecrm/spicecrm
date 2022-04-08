/**
 * @module ModuleActivities
 */
import {Component, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tasks-manager-tasks',
    templateUrl: '../templates/tasksmanagertasks.html',
})
export class TasksManagerTasks {
    /**
     * reference to the content used when the
     */
    @Output() public taskselected: EventEmitter<string> = new EventEmitter<string>();

    public focus: string = '';

    constructor(public language: language, public modellist: modellist) {

    }

    /**
     * triggers teh selection of a task
     *
     * @param id
     */
    public selectTask(id) {
        this.focus = id;
        this.taskselected.emit(id);
    }

    /**
     * handle the screoll event when emitted from the tobottom directive
     */
    public handleScroll() {
        this.modellist.loadMoreList();
    }
}
