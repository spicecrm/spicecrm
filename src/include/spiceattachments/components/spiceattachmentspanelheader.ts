/**
 * @module ModuleWorkflow
 */
import {
    Component, OnDestroy, OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {language} from '../../../services/language.service';
import {modelattachments} from '../../../services/modelattachments.service';

@Component({
    templateUrl: '../templates/spiceattachmentspanelheader.html',
    providers:[modelattachments]

})
export class SpiceAttachmentsPanelHeader implements OnInit, OnDestroy {

    /**
     * subscroibe to the broadcast to catch when the panel issues the number
     */
    public broadcastSubscription: any = {};

    /**
     * the count recieved
     */
    public attachmentcount: number = 0;

    constructor(public model: model, public modelattachments: modelattachments, public language: language, public broadcast: broadcast) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * get the count also if the panel is not forced to load
     */
    public ngOnInit(): void {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
        this.modelattachments.getCount().subscribe(count => {
            this.attachmentcount = count;
        });
    }

    /**
     * check if there are workflows
     */
    get hasAttachments() {
        return this.attachmentcount > 0 ? true : false;
    }

    /**
     * handle the broadcast message
     *
     * @param message
     */
    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id){
            return;
        }

        switch (message.messagetype) {
            case 'attachments.loaded':
                this.attachmentcount = message.messagedata.attachmentcount;
                break;

        }
    }

    /**
     * make sure on destroy to unsubscribe from the broadcast
     */
    public ngOnDestroy() {
        this.broadcastSubscription.unsubscribe();
    }
}
