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
    templateUrl: './src/include/spicenotes/templates/spicenotespanelheader.html'

})
export class SpiceNotesPanelHeader implements OnDestroy {

    /**
     * subscroibe to the broadcast to catch when the panel issues the number
     */
    private broadcastSubscription: any = {};

    /**
     * the count recieved
     */
    private notecount: number = 0;

    constructor(private model: model, private language: language, private broadcast: broadcast) {
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
    private handleMessage(message: any) {
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
