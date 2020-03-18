/**
 * @module ObjectComponents
 */
import {
    ComponentFactoryResolver, Component,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {favorite} from '../../services/favorite.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-recordview',
    templateUrl: './src/objectcomponents/templates/objectrecordview.html',
    providers: [model]

})
export class ObjectRecordView implements OnInit, OnDestroy {
    private moduleName: any = '';
    private componentconfig: any = {};
    private componentSubscriptions: Subscription = new Subscription();

    constructor(
        private broadcast: broadcast,
        private navigation: navigation,
        private navigationtab: navigationtab,
        private activatedRoute: ActivatedRoute,
        private metadata: metadata,
        private model: model,
        private favorite: favorite,
    ) {
        this.componentSubscriptions.add(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));
    }

    public ngOnInit() {
        // this.moduleName = this.activatedRoute.params['value'].module;
        this.moduleName = this.navigationtab.activeRoute.params.module;

        // set theenavigation paradigm
        // this.navigation.setActiveModule(this.moduleName);

        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.navigationtab.activeRoute.params.id;

        // set data to the FAV service
        this.favorite.enable(this.model.module, this.model.id);

        this.model.getData(true, 'detailview', true, true).subscribe(data => {
            // this.navigation.setActiveModule(this.moduleName, this.model.id, data.summary_text);
            this.navigationtab.setTabInfo({displayname: data.summary_text, displaymodule: this.model.module});
        });

        /**
         * load the component config
         */
        this.componentconfig = this.metadata.getComponentConfig('ObjectRecordView', this.moduleName);

    }

    /**
     * unsbscribve from all subscriptions
     */
    public ngOnDestroy() {
        this.componentSubscriptions.unsubscribe();

    }

    /**
     * react to model changes if the happen outside of the scope
     *
     * @param message
     */
    private handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                if (this.model.module === message.messagedata.module && this.model.id === message.messagedata.id) {
                    this.model.data = message.messagedata.data;
                }
                break;
        }
    }


}
