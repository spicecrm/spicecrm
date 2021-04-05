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
 * @module ModuleACL
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclobjects-manager-object',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobject.html',
    providers: [model]
})
export class ACLObjectsManagerObject implements OnChanges {

    @Input() private objectid: string = '';
    @Input() private typeid: string = '';
    private loaded: boolean = false;

    private tabs: any[] = [
        // {tab: 'details', label: 'LBL_DETAILS', component: 'ACLObjectsManagerObjectDetails'},
        // {tab: 'fieldvalues', label: 'LBL_FIELDVALUES', component: 'ACLObjectsManagerObjectFieldvalues'},
        // {tab: 'fieldcontrols', label: 'LBL_FIELDCONTROLS', component: 'ACLObjectsManagerObjectFields'},
        // {tab: 'territory', label: 'LBL_SPICEACLTERRITORY'}
    ];
    private activeTab: string = '';

    @ViewChild('header', {read: ViewContainerRef, static: true}) private header: ViewContainerRef;

    constructor(private metadata: metadata, private backend: backend, private model: model, private language: language) {
        this.model.module = 'SpiceACLObjects';

        // get config
        let componentConfig = this.metadata.getComponentConfig('ACLObjectsManagerObject', this.model.module);
        if (componentConfig.componentset) {
            let componentsetObjects = this.metadata.getComponentSetObjects(componentConfig.componentset);
            for (let componentsetObject of componentsetObjects) {
                this.tabs.push({
                    tab: componentsetObject.id,
                    label: componentsetObject.componentconfig.name,
                    component: componentsetObject.component
                });

                // select the first one as active tab
                if (!this.activeTab) {
                    this.activeTab = componentsetObject.id;
                }
            }
        }
    }

    private switchTab(tab) {
        this.activeTab = tab;
    }

    public ngOnChanges() {
        this.loaded = false;
        if (this.objectid) {
            this.model.id = this.objectid;
            this.model.getData(true).subscribe(data => {
                this.loaded = true;
            });
        }
    }

    private save() {
        this.model.save(true);
    }

}
