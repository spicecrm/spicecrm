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
    Component,
    Input,
    Output,
    EventEmitter,
    Injector,
    ViewChild,
    ViewContainerRef,
    AfterViewInit, OnChanges
} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';

/**
 * the container for the item in the list. Can be seleted by the angular selector and also handle the click on the element and propagate the click to the actionable function on the item
 */
@Component({
    selector: 'object-status-network-button-item',
    templateUrl: './src/objectcomponents/templates/objectstatusnetworkbuttonitem.html'
})
export class ObjectStatusNetworkButtonItem implements AfterViewInit, OnChanges {

    /**
     * a viewcontainer ref to the container itself so the action set item can render the component from the config in this element
     */
    @ViewChild("componentcontainer", {
        read: ViewContainerRef,
        static: true
    }) private componentcontainer: ViewContainerRef;

    /**
     * the item
     */
    @Input() private item: any = {};

    /**
     * the rendered action component if there is one rendered
     */
    private actioncomponent: any;

    private initialized: boolean = false;

    constructor(private language: language, private metadata: metadata, private modal: modal, private model: model, private injector: Injector) {

    }

    /**
     * a getter called from the button to triger the click
     */
    get id() {
        return this.item.id;
    }

    /**
     * checks if we have a component
     */
    get hasComponent() {
        return this.item.status_component && this.item.status_component != '';
    }

    /**
     * render the component if we have a status component
     */
    public ngAfterViewInit(): void {
        if (this.hasComponent) {
            this.metadata.addComponent(this.item.status_component, this.componentcontainer, this.injector).subscribe(actioncomponent => {
                this.actioncomponent = actioncomponent.instance;
                actioncomponent.instance.item = this.item;
            });
        }

        this.initialized = true;
    }

    public ngOnChanges(): void {
        if(this.actioncomponent) {
            this.actioncomponent.self.destroy();
            this.actioncomponent = null;
        }
        if (this.initialized && this.hasComponent) {
            this.metadata.addComponent(this.item.status_component, this.componentcontainer, this.injector).subscribe(actioncomponent => {
                this.actioncomponent = actioncomponent.instance;
                actioncomponent.instance.item = this.item;
            });
        }
    }

    /**
     * public function to set the status .. triggered by the li of the element embedding
     *
     * first prompts if a prompt message is set, then excutes
     */
    public setStatus(statusfield) {
        if (this.item.prompt_label) {
            this.modal.confirm(this.language.getLabel(this.item.prompt_label, '', 'long'), this.language.getLabel(this.item.prompt_label, '')).subscribe(response => {
                if (response) {
                    this.executeChange(statusfield);
                }
            });
        } else {
            this.executeChange(statusfield);
        }
    }

    /**
     * executes the change on the embedded component or on the item itself
     * executes the model editing in silent mode
     *
     * @param statusfield
     */
    private executeChange(statusfield) {
        if(this.actioncomponent && this.actioncomponent.execute) {
            this.actioncomponent.execute();
        } else {
            this.model.startEdit(true, true);
            this.model.setField(statusfield, this.item.status_to);
            if (this.model.validate()) {
                this.model.save();
            } else {
                this.model.edit();
            }
        }
    }
}
