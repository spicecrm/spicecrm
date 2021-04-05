/*
SpiceUI 2021.01.001

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
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'object-listview-container',
    templateUrl: './src/objectcomponents/templates/objectlistviewcontainer.html'
})
export class ObjectListViewContainer implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;
    private moduleName: any = '';
    private initialized: boolean = false;
    private componentRefs: any = [];
    private componentSubscriptions: any[] = [];

    constructor(private metadata: metadata, private broadcast: broadcast, private navigation: navigation, private navigationtab: navigationtab) {
        // subscribe to route params.module changes
        this.navigationtab.activeRoute$.subscribe(route=>{
            this.moduleName = route.params.module;
            if (this.initialized) {
                this.buildContainer();
            }
        });

        // subscribe to applauncher.setrole
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    public ngOnDestroy() {
        // destroy components
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // unsubscribe from Observables
        for (let componentSubscription of this.componentSubscriptions) {
            componentSubscription.unsubscribe();
        }
    }

    /*
    * @add ObjectListViewContainer components from componentConfig
    * @pass componentconfig to componentRef
    * @push componentRef to componentRefs
    */
    private buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        this.componentRefs = [];

        let componentconfig = this.metadata.getComponentConfig('ObjectListViewContainer', this.moduleName);
        for (let view of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                if (view.componentconfig && Object.keys(view.componentconfig).length > 0) {
                    componentRef.instance.componentconfig = view.componentconfig;
                } else {
                    componentRef.instance.componentconfig = this.metadata.getComponentConfig(view.component, this.moduleName);
                }
                this.componentRefs.push(componentRef);
            });
        }
    }

    /*
    * @handle broadcast message
    * @param message: object
    * @buildContainer
    */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }
}
