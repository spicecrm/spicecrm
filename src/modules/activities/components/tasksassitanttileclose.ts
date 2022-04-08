/**
 * @module ModuleActivities
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {helper} from '../../../services/helper.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'tasks-assistant-tile-close',
    templateUrl: '../templates/tasksassitanttileclose.html',
})
export class TasksAssitantTileClose {

    constructor(public model: model, public language: language, public helper: helper, public broadcast: broadcast) {
    }

    doAction(){
        // this.showDialog = true;
        this.helper.confirm(this.language.getLabel('LBL_COMPLETE_TASK'), this.language.getLabel('MSG_COMPLETE_TASK')).subscribe(answer =>{
            if(answer){
                this.model.setField('status', 'Completed');
                this.model.save();

                // broadcast so the assitant removes it
                this.broadcast.broadcastMessage('assistant.complete', {id: this.model.id, module: 'Assistant', data: this.model.data});
            }
        });
    }
}
