/**
 * @module ModuleActivities
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'activity-textmessages-chat-message',
    templateUrl: '../templates/activitytextmessageschatmessage.html',
    providers: [model],
    standalone: false
})
export class ActivityTextMessagesChatMessage implements OnInit {

    @Input() chatMessage: any;


    constructor(
        public model: model
    ) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
       this.model.module = this.chatMessage.module;
       this.model.id = this.chatMessage.id;
       this.model.initialize();
       this.model.setData(this.chatMessage.data);
    }

    get direction(){
        return this.model.getField('direction');
    }

    get message(){
        return this.model.getField('description');
    }

    get messagedate(){
        return this.model.getField('date_sent');
    }

}
