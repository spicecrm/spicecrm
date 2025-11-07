/**
 * @module ModuleActivities
 */
import {Component, EventEmitter, OnInit, Output, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";


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

    /**
     * when we are sending
     */
    public sending: boolean = false;

    /**
     * the event emitter when a message was sent
     */
    @Output() messagesent: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        @SkipSelf() public parent: model,
        public model: model,
        public view: view
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.initializeModel();
    }

    /**
     * getter to disable the send button
     */
    public canSend(){
        return this.parent.getField('phone_mobile') && this.model.getField('description') && this.model.getField('mailbox_id') && !this.sending;
    }

    /**
     * initialize the model
     */
    public initializeModel(){
        this.model.module = 'TextMessages';
        this.model.id = undefined;
        this.model.initialize();
    }

    /**
     * sends the message
     */
    public send(){
        this.model.setFields({
            msisdn: this.parent.getField('phone_mobile'),
            parent_type: this.parent.module,
            parent_id: this.parent.id
        })

        // set that we are sending
        this.sending = true;

        // save the model
        this.model.save().subscribe({
            next: () => {
                this.messagesent.emit(this.model.id);
                this.initializeModel();
                this.sending = false;
            }
        })
    }

}
