import {OnInit, Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import { activitiyTimeLineService } from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline-container',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinecontainer.html',

})
export class ObjectActivitiyTimelineContainer implements OnInit {

    @Input() module: string = '';

    constructor(private activitiyTimeLineService: activitiyTimeLineService, private language: language) {}

    ngOnInit() {
        this.activitiyTimeLineService.getTimeLineData(this.module);
    }

    get activities(){
        return this.activitiyTimeLineService.activities[this.module].list
    }

    get hasActivities(){
        return this.activitiyTimeLineService.activities[this.module].list.length > 0 ? true : false;
    }

    isCall(module){
        return module === 'Calls';
    }
    isMeeting(module){
        return module === 'Meetings';
    }
    isEmail(module){
        return module === 'Emails';
    }
    isTask(module){
        return module === 'Tasks';
    }
    isNote(module){
        return module === 'Notes';
    }

    get loading(){
        return this.activitiyTimeLineService.activities[this.module].loading;
    }
}