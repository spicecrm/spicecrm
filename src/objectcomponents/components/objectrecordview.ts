/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    /**
     * the name of the module
     * @private
     */
    private moduleName: any = '';

    /**
     * the componentconfig
     * @private
     */
    private componentconfig: any = {};

    /**
     * any subnscriptions thois component might have that need to be destroyed when the component is destroyed
     * @private
     */
    private componentSubscriptions: Subscription = new Subscription();

    /**
     * indicates if the model here is loaded
     *
     * @private
     */
    private modelloaded: boolean = false;

    constructor(
        private broadcast: broadcast,
        private navigation: navigation,
        private navigationtab: navigationtab,
        private activatedRoute: ActivatedRoute,
        private metadata: metadata,
        private model: model,
        private favorite: favorite,
    ) {

    }

    public ngOnInit() {
        // this.moduleName = this.activatedRoute.params['value'].module;
        this.moduleName = this.navigationtab.activeRoute.params.module;

        // set theenavigation paradigm
        // this.navigation.setActiveModule(this.moduleName);

        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.navigationtab.activeRoute.params.id;

        // retrieve the model data
        this.model.getData(true, 'detailview', true, true).subscribe(data => {
            // this.navigationtab.setTabInfo({displayname: data.summary_text, displaymodule: this.model.module});
            this.modelloaded = true;
        });

        /**
         * load the component config
         */
        this.componentconfig = this.metadata.getComponentConfig('ObjectRecordView', this.moduleName);

        /**
         * subscribe to the broadcast
         */
        this.componentSubscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );

        /**
         * subscribe to the model data changes
         */
        this.componentSubscriptions.add(
            this.model.data$.subscribe(() => this.setTabTitle())
        );

    }

    /**
     * unsbscribe from all subscriptions
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

                    // update the tab info
                    this.navigationtab.setTabInfo({
                        displayname: message.messagedata.data.summary_text,
                        displaymodule: this.model.module
                    });
                }
                break;
        }
    }

    private setTabTitle() {
        this.navigationtab.setTabInfo({
            displayname: this.model.getField('summary_text'),
            displaymodule: this.model.module
        });
    }
}
