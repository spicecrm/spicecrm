/**
 * @module ModuleSpiceNotes
 */
import {
    Component, OnDestroy
} from '@angular/core';
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {language} from '../../../services/language.service';

@Component({
    templateUrl: '../templates/spicenotespanelheader.html'

})
export class SpiceNotesPanelHeader implements OnDestroy {

    /**
     * subscroibe to the broadcast to catch when the panel issues the number
     */
    public broadcastSubscription: any = {};

    /**
     * the count recieved
     */
    public notecount: number = 0;

    constructor(public model: model, public language: language, public broadcast: broadcast) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * check if there are workflows
     */
    get hasNotes() {
        return this.notecount > 0 ? true : false;
    }

    /**
     * handle the broadcast message
     *
     * @param message
     */
    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id) {
            return;
        }

        switch (message.messagetype) {
            case 'spicenotes.loaded':
                this.notecount = message.messagedata.spicenotescount;
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
