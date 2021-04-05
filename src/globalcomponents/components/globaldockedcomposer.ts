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
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';

declare var _: any;

@Component({
    selector: 'global-docked-composer',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposer.html',
    providers: [model, view]
})
export class GlobalDockedComposer implements OnInit {

    /**
     * refernce to the container content
     */
    @ViewChild('containercontent', {read: ViewContainerRef, static: true}) private containercontent: ViewContainerRef;

    @Input() public composerdata: any = {};
    @Input() public composerindex: number;

    /**
     * if the composer is closed
     *
     * @private
     */
    private isClosed: boolean = false;

    /**
     * the actionset to be rendered in teh composer
     *
     * @private
     */
    private actionset: string;

    constructor(private metadata: metadata, private dockedComposer: dockedComposer, private language: language, private model: model, private view: view, private modal: modal, private ViewContainerRef: ViewContainerRef) {
        // set the view to editable and to editmode
        this.view.isEditable = true;
        this.view.setEditMode();

        // set the model to editing
        this.model.isEditing = true;

        // set to global
        this.model.isGlobal = true;
    }

    public ngOnInit() {
        // initialize the model
        this.model.module = this.composerdata.module;
        this.model.id = this.composerdata.id;

        if (this.composerdata.model.data) {
            this.model.data = this.composerdata.model.data;
        } else {
            this.model.initializeModel();
        }

        this.dockedComposer.composers[this.composerindex].model = this.model;

        // get the config
        let componentconfig = this.metadata.getComponentConfig('GlobalDockedComposer', this.model.module);
        if (componentconfig.componentset) {
            let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
            for (let component of components) {
                this.metadata.addComponent('ObjectRecordFieldset', this.containercontent).subscribe(componentRef => {
                    componentRef.instance.componentconfig = component.componentconfig;
                });
            }
        } else if (componentconfig.fieldset) {
            this.metadata.addComponent('ObjectRecordFieldset', this.containercontent).subscribe(componentRef => {
                componentRef.instance.direction = 'vertical';
                componentRef.instance.fieldset = componentconfig.fieldset;
            });
        }

        // set the actionset
        this.actionset = componentconfig.actionset;

        // check if the composer should be auto expanded on init
        if (this.composerdata.loadexpanded && this.canExpand) {
            this.expand();
            this.composerdata.loadexpanded = false;
        }
    }

    /**
     * getter for a display label
     * Eiter displays the modal name if set or the module name
     */
    get displayLabel() {
        return this.model.data.name ? this.model.data.name : this.language.getModuleName(this.model.module, true);
    }

    /**
     * toggles the composer to be open or closed
     *
     * @private
     */
    private toggleClosed() {
        this.isClosed = !this.isClosed;
    }

    /**
     * returns the toggle icon to either minimize or maximize the composer based on the close state
     */
    get toggleIcon() {
        return this.isClosed ? 'erect_window' : 'minimize_window';
    }

    /**
     * checks if a GlobalDockedComposermodal is availabe for the module and thus the modal can be opened.
     */
    get canExpand() {
        return !_.isEmpty(this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module));
    }

    /**
     * expands the comoser and opens the GlobalDockedComposerModal window
     *
     * @private
     */
    private expand() {
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
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

    /**
     * closes the current composer
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
     * closes the composer
     *
     * @private
     */
    private closeComposer() {
        for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
            if (this.dockedComposer.composers[i].id === this.composerdata.id) {
                this.dockedComposer.composers.splice(i, 1);
            }
        }
    }
}
