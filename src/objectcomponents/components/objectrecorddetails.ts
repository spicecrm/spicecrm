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
import {
    OnInit,
    ComponentFactoryResolver,
    Component,
    Renderer2, Input, OnDestroy
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-record-details',
    templateUrl: './src/objectcomponents/templates/objectrecorddetails.html',
    providers: [view]
})
export class ObjectRecordDetails implements OnInit, OnDestroy {

    /**
     * the componentset to be rendered
     */
    @Input() private componentSet: string;

    /**
     * optional to force the view to be readonly
     */
    @Input() private readonly: boolean;

    /**
     * the component config
     */
    private componentconfig: any = {};

    /**
     * any subscriptions the component might have
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private view: view, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model, private language: language, private renderer: Renderer2) {
    }

    public ngOnInit() {
        // check if we are in readonly mode or if the view shpoudl be set as editable
        if (this.readonly === true || this.componentconfig.readonly) {
            this.view.isEditable == false;
        } else {
            this.view.isEditable = true;

            this.view.linkedToModel = true;

            // subscribe to the view mode
            // in case the view is set external to editing .. also set the model to edit mode
            this.subscriptions.add(this.view.mode$.subscribe(mode => {
                if (mode == 'edit' && !this.model.isEditing) {
                    this.model.startEdit();
                }
            }));
        }

        this.buildContainer();
    }

    /**
     * destroy the component and unsubscribe form an ysubcription that still might remain
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * trys to get the compoenntset if it is not set and renders the container
     */
    private buildContainer() {
        if (!this.componentSet) {
            // if we do not have a coimponentset from external check the default config
            if (!this.componentconfig.componentset) {
                let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
                this.componentSet = componentconfig.componentset;
            } else {
                this.componentSet = this.componentconfig.componentset;
            }
        }
    }

    /**
     * adds the shadow for the editing style
     */
    private getBoxStyle() {
        if (this.view.isEditMode()) {
            return {
                'box-shadow': '0 2px 4px 4px rgba(0,0,0,.16)',
            };
        } else {
            return {};
        }
    }

    get showHeader() {
        return this.componentconfig.header ? true : false;
    }

    get header() {
        return this.language.getLabel(this.componentconfig.header, this.model.module);
    }

}
