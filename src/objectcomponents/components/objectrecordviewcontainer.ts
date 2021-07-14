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
    AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-recordview-container',
    templateUrl: './src/objectcomponents/templates/objectrecordviewcontainer.html',
    providers: [model]
})
export class ObjectRecordViewContainer implements OnDestroy, AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;
    private module: string = '';
    private id: string = '';
    private initialized: boolean = false;
    private componentset: string = '';
    private componentRefs: any[] = [];

    private componentSubscriptions: Subscription = new Subscription();

    constructor(private navigation: navigation,
                private navigationtab: navigationtab,
                private activatedRoute: ActivatedRoute,
                private metadata: metadata,
                private model: model,
                private broadcast: broadcast,
                private elementref: ElementRef) {

        this.componentSubscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                if (this.module != route.params.module || this.id != route.params.id) {
                    this.module = route.params.module;
                    this.id = route.params.id;

                    if (this.initialized) {
                        this.buildContainer();
                    }
                }
            })
        );
        this.componentSubscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }

    public ngAfterViewInit(): void {
        this.initialized = true;
        this.buildContainer();
    }

    public ngOnDestroy() {
        this.componentSubscriptions.unsubscribe();
    }

    private buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewContainer', this.module);
        this.componentset = componentconfig.componentset;

        for (let view of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                componentRef.instance.componentconfig = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }

    }
}
