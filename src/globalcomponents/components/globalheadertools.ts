/**
 * @module GlobalComponents
 */
import {Component, AfterViewInit, ViewContainerRef, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';


/**
 * renders the components as part of the globak Headerr tools in the upper right corner of the app
 */
@Component({
    selector: 'global-header-tools',
    templateUrl: '../templates/globalheadertools.html'
})
export class GlobalHeaderTools implements OnInit{

    /**
     * the componentset to be rendered
     */
    public componentset: string;

    constructor(public session: session, public metadata: metadata, public router: Router, public language: language, public broadcast: broadcast) {
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
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderTools');
        this.componentset = componentconfig.componentset;
    }

}
