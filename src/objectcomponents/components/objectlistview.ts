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

import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';
import {navigationtab} from '../../services/navigationtab.service';
import {navigation} from '../../services/navigation.service';
import {userpreferences} from '../../services/userpreferences.service';

/**
 * the default route set to display the list view
 */
@Component({
    selector: 'object-listview',
    templateUrl: './src/objectcomponents/templates/objectlistview.html',
    providers: [modellist, model]
})
export class ObjectListView implements AfterViewInit, OnDestroy {

    /**
     * an elament ref to the container to render the compoonentsets
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * holds references to the rendered components. if rerendering they need to be destoryed when the route changes
     */
    private componentRefs: any = [];

    /**
     * the subscription to the list view changes since the component is rendered here
     */
    private modellistSubscription: any;

    constructor(private navigation: navigation, private navigationtab: navigationtab, private activatedRoute: ActivatedRoute, private metadata: metadata, private modellist: modellist, private model: model, private userpreferences: userpreferences) {

        // get the module from teh activated route
        // this.model.module = this.activatedRoute.params['value']['module'];
        this.model.module = this.navigationtab.activeRoute.params.module;

        // set the navigation paradigm
        // this.navigation.setActiveModule(this.model.module);

        // set the module and get the list
        this.modellist.module = this.model.module;

        // set so the views use the cahced results
        this.modellist.usecache = true;
    }

    /**
     * register the listener to the modellist service to
     */
    public ngAfterViewInit() {
        this.modellistSubscription = this.modellist.listcomponent$.subscribe(listcomponent => {
            if (listcomponent) {
                // set the current list and rebuild the container
                this.buildContainer(listcomponent);
            }
        });
    }

    /**
     * unsubscribe from the modellist service so this can b e closed and cleaned up properly
     */
    public ngOnDestroy(): void {
        this.modellistSubscription.unsubscribe();
    }

    /**
     * renders a compoentnset in the container
     *
     * @param component the component to be rendered
     */
    private buildContainer(component) {
        // clean the existing rendered components
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // render the new component
        this.metadata.addComponent(component, this.container).subscribe(componentRef => {
            this.componentRefs.push(componentRef);
        });
    }

}
