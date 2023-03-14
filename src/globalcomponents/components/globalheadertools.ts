/**
 * @module GlobalComponents
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {userpreferences} from "../../services/userpreferences.service";


/**
 * renders the components as part of the globak Headerr tools in the upper right corner of the app
 */
@Component({
    selector: 'global-header-tools',
    templateUrl: '../templates/globalheadertools.html'
})
export class GlobalHeaderTools implements OnInit {

    /**
     * the array with the list of components to be rendered
     */
    public components: any[] = [];

    constructor(public metadata: metadata,
                public userPreferences: userpreferences,
                public broadcast: broadcast) {
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    public ngOnInit() {
        this.buildTools();
    }

    public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
                this.buildTools();
                break;

        }
    }

    public buildTools() {
        let config = this.metadata.getComponentConfig('GlobalHeaderTools');
        if (!config.componentset) return;
        this.components = this.metadata.getComponentSetObjects(config.componentset);
    }

}
