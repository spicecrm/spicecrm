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
 * @module ModuleGroupware
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {navigation} from "../../../services/navigation.service";
import {broadcast} from "../../../services/broadcast.service";
import {navigationtab} from "../../../services/navigationtab.service";

/**
 * The pane shows the details customized for the oputlook add in
 */
@Component({
    selector: 'groupware-detail-pane-view',
    templateUrl: './src/include/groupware/templates/groupwaredetailpaneview.html',
    providers: [model]
})
export class GroupwareDetailPaneView implements AfterViewInit, OnDestroy {

    /**
     * reference to the header container
     */
    @ViewChild('header', {read: ViewContainerRef, static: true}) private header: ViewContainerRef;

    /**
     * reference to the main container
     */
    @ViewChild('main', {read: ViewContainerRef, static: true}) private main: ViewContainerRef;

    /**
     * indicates that we have passed the view initialization and can render the view
     */
    private initialized: boolean = false;

    /**
     * the rendered componentes that need to be destroyed if we rerender
     */
    private componentRefs: any[] = [];

    /**
     * subscriptions that need to be unsubscribed in the on Destroy lifecycle hook
     */
    private componentSubscriptions: Subscription = new Subscription();

    constructor(private navigation: navigation,
                private navigationtab: navigationtab,
                private broadcast: broadcast,
                private metadata: metadata,
                private model: model) {

        // subsribe to the route
        this.componentSubscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                this.setRouteData(route);
            })
        );

        // subscribe to the broacast message
        this.componentSubscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    /**
     * initialize and load based on the route data
     *
     * @param route
     */
    private setRouteData(route) {
        if (route.params.module && route.params.id && (this.model.module != route.params.module || this.model.id != route.params.id)) {
            // load the model
            // get the bean details
            this.model.module = route.params.module;
            this.model.id = route.params.id;
            this.model.getData(true, 'detailview', true, true).subscribe(data => {
                // this.navigation.setActiveModule(this.moduleName, this.model.id, data.summary_text);
                this.navigationtab.setTabInfo({displayname: data.summary_text, displaymodule: this.model.module});
            });

            if (this.initialized) {
                this.buildContainer();
            }
        }
    }

    /**
     * handles th ebroadcast message
     * ToDo: add the pinnable support here
     *
     * @param message
     */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }

    /**
     * initialize the view and render it
     */
    public ngAfterViewInit(): void {
        if (this.model.module && this.model.id) {
            this.initialized = true;
            this.buildContainer();
        }
    }

    /**
     * unsubscribe from all subscriptions
     */
    public ngOnDestroy() {
        this.componentSubscriptions.unsubscribe();
    }

    /**
     * load the config and build the container
     */
    private buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('GroupwareDetailPane', this.model.module);

        for (let view of this.metadata.getComponentSetObjects(componentconfig.header)) {
            this.metadata.addComponent(view.component, this.header).subscribe(componentRef => {
                componentRef.instance.componentconfig = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }

        for (let view of this.metadata.getComponentSetObjects(componentconfig.main)) {
            this.metadata.addComponent(view.component, this.main).subscribe(componentRef => {
                componentRef.instance.componentconfig = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }

    }
}
