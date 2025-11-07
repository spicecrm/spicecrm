/**
 * @module ModuleActivities
 */
import {Component, Injector, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {model} from '../../../services/model.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {metadata} from "../../../services/metadata.service";
import {layout} from "../../../services/layout.service";
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";

/**
 * @ignore
 */
declare var moment;

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
