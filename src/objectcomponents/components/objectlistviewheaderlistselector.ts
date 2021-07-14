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
import {Component, Input, Output, Renderer2, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {userpreferences} from '../../services/userpreferences.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-listview-header-list-selector',
    templateUrl: './src/objectcomponents/templates/objectlistviewheaderlistselector.html'
})
export class ObjectListViewHeaderListSelector implements OnInit {

    /**
     * the componentconfig
     */
    private componentconfig: any;

    /**
     * loads the config for the ObjectLiustView with the items to be displayed as list view alternatives
     *
     * @param metadata
     * @param userpreferences
     * @param modellist
     * @param language
     * @param model
     * @param elementRef
     * @param renderer
     */
    constructor(private metadata: metadata,
                private userpreferences: userpreferences,
                private modellist: modellist,
                private language: language,
                private model: model,
                private elementRef: ElementRef,
                private renderer: Renderer2) {
    }

    /**
     * call the initialize method
     */
    public ngOnInit() {
        this.initialize();
    }

    /**
     * load the component config and update the standard list component if selected
     * @private
     */
    private initialize() {

        this.loadComponentConfig();

        if (!this.modellist.currentList) {
            return;
        }
        // set the default list component if the current list id is all or owner
        if (['all', 'owner'].indexOf(this.modellist.currentList.id) != -1) {
            this.modellist.updateStandardListsComponent(this.modellist.currentList.id, this.getDefaultComponent());
        }
    }

    /**
     * get the default component
     * @private
     */
    private getDefaultComponent() {
        let component = this.userpreferences.getPreference('defaultlisttype', this.modellist.module);
        return component || this.componentconfig.lists[0].component;
    }

    /**
     * load the component config and build the list of the available component
     * @private
     */
    private loadComponentConfig() {
        let config = this.metadata.getComponentConfig('ObjectListView', this.model.module);
        let items = this.metadata.getComponentSetObjects(config.componentset);
        this.componentconfig = {
            lists: items.map(item => ({
                component: item.component,
                icon: item.componentconfig.icon ? item.componentconfig.icon : 'list',
                label: item.componentconfig.name
            }))
        };
    }

    /**
     * getter for the current list icon
     */
    get currentListIcon() {
        let icon: string = '';
        if (this.componentconfig.lists) {
            let thislist = this.componentconfig.lists.find(list => list.component == this.modellist.currentList.listcomponent);
            icon = thislist?.icon;
        }

        return icon;
    }

    /**
     * simple getter if the button shoudl be disabled
     */
    get disabled() {
        return !(this.componentconfig.lists.length > 1) || this.modellist.isLoading;
    }

    /**
     * sets the list type
     *
     * @param component
     */
    private setListComponent(component) {
        if (!this.modellist.currentList) {
            return;
        }
        if (['all', 'owner'].indexOf(this.modellist.currentList.id) != -1) {
            this.modellist.updateStandardListsComponent(this.modellist.currentList.id, component);
        } else {
            this.modellist.updateListTypeComponent(component);
        }
    }
}
