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
 * @module ModuleActivities
 */
import {AfterViewInit, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {dockedComposer} from '../../../services/dockedcomposer.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * @ignore
 */
declare var moment: any;
declare var _: any;

/**
 * a component that is a generic container for adding items as part of the activitiy add container
 */
@Component({
    selector: 'activitytimeline-add-item',
    templateUrl: './src/modules/activities/templates/activitytimelineadditem.html',
    providers: [model, view]
})
export class ActivityTimelineAddItem implements OnInit, OnDestroy {

    /**
     * @ignore
     *
     * the componentconfig that is added whent eh component is added
     */
    private componentconfig: any = {};

    /**
     * the fieldset for the header. Pulled from the componentnconfig for the component and the module
     */
    private headerFieldSet: string = '';

    /**
     * the fieldset for the body. Pulled from the componentnconfig for the component and the module
     */
    private bodyFieldSet: string = '';

    /**
     * the position for the utility buttons (cancel, expand, dock)
     */
    private utilityButtonsPosition: string = 'bottom';

    /**
     * @ignore
     *
     * indicator if the panel is expanded or not
     */
    public isExpanded: boolean = false;

    /**
     * set top true if the module can expand into a global docked composer modal
     * checked if the config exists
     */
    public canExpand: boolean = false;

    /**
     * set top true if the module can be docked into a composer
     * checked if the config exists
     */
    public canDock: boolean = false;

    /**
     * @ignore
     *
     * a handler to the parent subscription
     */
    private parentSubscription: any;

    constructor(public metadata: metadata, public activitiytimeline: activitiytimeline, public model: model, public view: view, public language: language, public modal: modal, public dockedComposer: dockedComposer, public ViewContainerRef: ViewContainerRef) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        // initialize the model
        this.model.module = this.module;

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.parentSubscription = this.activitiytimeline.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id) {
                this.model.data.parent_name = data.summary_text;
            }
        });

        // set view to editbale and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fields
        this.headerFieldSet = this.componentconfig.headerfieldset;
        this.bodyFieldSet = this.componentconfig.bodyfieldset;

        // position for buttons
        if(this.componentconfig.utilitybuttonsposition) {
            this.utilityButtonsPosition = this.componentconfig.utilitybuttonsposition;
        }

        // check if the model can expand in a GlobalDockedComposerModal
        this.checkCanExpand();

        // check if the model can be docked into a GlobalDockedComposer
        this.checkCanDock();
    }

    /**
     * @ignore
     *
     * cancels the subscription on the parent
     */
    public ngOnDestroy(): void {
        if (this.parentSubscription) this.parentSubscription.unsubscribe();
    }

    /**
     * getter for the module from the componentconfig
     */
    get module() {
        return this.componentconfig.module;
    }

    /**
     * getter for the actionset fromn the config
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns if attachments are allowed. Then displays the attachment panel
     */
    get allowattachments() {
        return this.componentconfig.allowattachments === true ? true : false;
    }

    /**
     * initializes the model when the item is expanded
     */
    private initializeModule() {
        this.model.module = this.module;
        // SPICEUI-2
        this.model.id = undefined;
        this.model.initializeModel(this.activitiytimeline.parent);

    }

    /**
     * the trigger when the header fieldset or any item therein in focused and the item is expanded
     */
    private onHeaderClick() {
        if (!this.isExpanded) {
            this.isExpanded = true;
            this.initializeModule();

            // set start editing here as well so we can block navigating away
            this.model.startEdit(false);
        }
    }

    /**
     * checks if a GlobalDockedComposermodal is availabe for the module and thus the modal can be opened.
     */
    private checkCanExpand() {
        this.canExpand = !_.isEmpty(this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module));
    }

    /**
     * expands the item and renders it in a modal undocking it from the activity tiemline container
     */
    private expand() {
        this.dockedComposer.addComposer(this.model.module, this.model, true);
        // this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
        this.isExpanded = false;
        this.initializeModule();
    }


    /**
     * checks if a GlobalDockedComposermodal is availabe for the module and thus the modal can be opened.
     */
    private checkCanDock() {
        this.canDock = !_.isEmpty(this.metadata.getComponentConfig('GlobalDockedComposer', this.model.module));
    }

    /**
     * docks the model to the docked composer and removes it from the activity timeline container
     */
    private dock() {
        this.dockedComposer.addComposer(this.model.module, this.model);
        this.isExpanded = false;
        this.initializeModule();
    }

    /**
     * cancels and collapses the container
     */
    private cancel() {
        this.model.cancelEdit();
        this.isExpanded = false;
        this.initializeModule();
    }

    /**
     * catches when a custom action has been fired.Closes the container and resets the model
     *
     * @param event the event fired from teh custom action
     */
    public handleaction(event) {
        this.initializeModule();
        this.view.setEditMode();
        this.isExpanded = false;
    }
}
