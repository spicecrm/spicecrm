/**
 * @module ModuleProcessManagement
 */
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {processmanagement} from "../services/processmanagement.service";
import {view} from "../../../services/view.service";
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'process-management-process-process',
    templateUrl: '../templates/processmanagementprocessprocess.html',
    providers: [model]
})
export class ProcessManagementProcessProcess implements OnInit, OnDestroy {

    /**
     * the process category
     */
    @Input() public process: any;

    /**
     * holds subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public router: Router,
        public backend: backend,
        public configuration: configurationService,
        public processmanagement: processmanagement,
        public broadcast: broadcast
    ) {
        this.subscriptions.add(
            this.broadcast.message$.subscribe({
                next: (msg) => {
                    switch (msg.messagetype) {
                        case 'model.save':
                            if (msg.messagedata.module == this.model.module && msg.messagedata.id == this.model.id) {
                                this.model.setData(msg.messagedata.data);
                            }
                            break;
                    }
                }
            })
        )
    }

    public ngOnInit() {

        this.model.module = 'ProcessMGMTProcesses';
        this.model.id = this.process.id;
        this.model.initialize();
        this.model.setData(this.process);

    }

    /**
     * unsubscribe from Broadcast on Destroy
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * sets custom color styles
     */
    get processStyle() {
        let styles: any = {};

        if (this.model.getField('color_bg')) {
            styles['background-color'] = this.model.getField('color_bg');
        }

        if (this.model.getField('color_tx')) {
            styles.color = this.model.getField('color_tx');
        }

        if (this.model.getField('color_bd')) {
            styles['border-color'] = this.model.getField('color_bd');
        }
        return styles;
    }

    /**
     * sets custom color styles
     */
    get processRemarkStyle() {
        let styles: any = {};

        if (this.model.getField('color_rm')) {
            styles.color = this.model.getField('color_rm');
        }

        return styles;
    }

}
