/**
 * @module ModuleLiveChat
 */
import {
    Component, Input,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {session} from "../../../services/session.service";

@Component({
    selector: 'activitytimeline-textmessages',
    templateUrl: '../templates/activitytimelinetextmessages.html',
    standalone: false
})
export class ActivityTimelineTextMessages {

    public description: string = '';
    public multipleline: string = '1';
    public mailboxid: string = '';
    public mailboxes: any = [];
    public messages: any = [];
    public loaded: boolean = false;

    public disabled: boolean = false;

    constructor(public backend: backend, public model: model, public language: language, public session: session) {
    }

    public ngOnInit() {
        this.getTextMessages(this.mailboxid);
    }

    /**
     * retrieve all messages relate to the current bean
     * @param mailbox_id
     */
    public getTextMessages(mailbox_id) {
        this.backend.getRequest('module/' + this.model.module + '/' + this.model.id + '/livechats', {} ).subscribe(res => {
            if (res) {
                this.messages = res.message;
                this.mailboxes = res.mailboxes;
                this.description = '';
                this.mailboxid = res.mailboxid;

                this.setLoaded();
            }
        });
    }

    public setLoaded(){
        this.loaded = true;
    }

    public onFocus() {
        this.multipleline='3';
    }



    /**
     * save a message
     * @param message
     * @param mailbox_id
     */
    public sendMessage(message,mailbox_id) {
        this.disabled = true;

        let body = {
            message: message,
            mailbox_id: mailbox_id
        };
        this.backend.postRequest('module/' + this.model.module + '/' + this.model.id + '/livechats',{}, body).subscribe(res=> {
            if(res) {
                this.getTextMessages(mailbox_id);
            }
        });
    }
}
