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
 * @module GlobalComponents
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-docked-composer-modal',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposermodal.html'
})
export class GlobalDockedComposerModal implements OnInit {

    /**
     * reference to the modal itself to close it
     *
     * @private
     */
    private self: any = {};


    /**
     * the componentconfig
     *
     * @private
     */
    private componentconfig: any;

    constructor(private metadata: metadata, private dockedComposer: dockedComposer, private language: language, public modal: modal, public model: model, private view: view) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // get the config
        this.loadConfig();
    }

    /**
     * loads the config
     *
     * @private
     */
    private loadConfig(){
        this.componentconfig = this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module);
    }

    /**
     * returns the display label
     */
    get displayLabel() {
        return this.model.data.name ? this.model.data.name : this.language.getModuleName(this.model.module, true);
    }

    /**
     * closes the modal and resturns back to the composer view
     * if the composer is not yet created .. create one in the process of minimizing
     * this happens when the composer window is created from another source and needs to be considered
     *
     * @private
     */
    private minimize() {
        // if we do not yet have a composer .. create one
        if(!this.dockedComposer.composers.find(c => c.id == this.model.id)){
            this.dockedComposer.addComposer(this.model.module, this.model);
        }
        // destroy the modal
        this.self.destroy();
    }

    /**
     * closes the composer and the modal
     *
     * @private
     */
    private promptClose() {
        this.modal.prompt('confirm', this.language.getLabel('MSG_CANCEL', '', 'long'), this.language.getLabel('MSG_CANCEL')).subscribe(answer => {
            if (answer) {
                this.closeComposer();
            }
        });
    }

    /**
     * closes the composer and the modal window
     * @private
     */
    private closeComposer() {
        for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
            if (this.dockedComposer.composers[i].id === this.model.id) {
                this.dockedComposer.composers.splice(i, 1);
            }
        }
        this.self.destroy();
    }

    /**
     * handle the action from the actionset that is returned
     *
     * @param action
     * @private
     */
    private handleaction(action) {
        switch (action) {
            case 'savegodetail':
                this.model.goDetail();
                this.closeComposer();
                break;
            default:
                this.closeComposer();
        }
    }
}
