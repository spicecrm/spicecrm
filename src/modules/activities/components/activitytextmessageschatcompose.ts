/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit, Optional} from '@angular/core';
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
    selector: 'activity-textmessages-chat-compose',
    templateUrl: '../templates/activitytextmessageschatcompose.html',
    providers: [model, view],
    standalone: false
})
export class ActivityTextMessagesChatCompose implements OnInit {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};


    constructor(
        public model: model,
        public view: view
    ) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {

    }

}
