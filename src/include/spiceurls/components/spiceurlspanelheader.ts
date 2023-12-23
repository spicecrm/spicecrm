/**
 * @module ModuleSpiceUrls
 * */
import {
    Component, OnDestroy, OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {language} from '../../../services/language.service';
import {modelurls} from '../../../services/modelurls.service';

/**
 * renders the url count in the panel header
 */
@Component({
    selector: 'spice-urls-panel-header',
    templateUrl: '../templates/spiceurlspanelheader.html',
    providers:[modelurls]

})
export class SpiceUrlsPanelHeader implements OnInit, OnDestroy {

    /**
     * subscroibe to the broadcast to catch when the panel issues the number
     */
    public broadcastSubscription: any = {};

    /**
     * the count recieved
     */
    public urlcount: number = 0;

    constructor(
        public model: model,
        public modelurls: modelurls,
        public language: language,
        public broadcast: broadcast) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * get the count also if the panel is not forced to load
     */
    public ngOnInit(): void {
        this.modelurls.module = this.model.module;
        this.modelurls.id = this.model.id;
        this.modelurls.getCount().subscribe(count => {
            this.urlcount = count;
        });
    }

    /**
     * check if there are workflows
     */
    get hasUrls() {
        return this.urlcount > 0 ? true : false;
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
            case 'urls.loaded':
                this.urlcount = message.messagedata.urlcount;
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
