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
import {Component, Renderer2, ElementRef, OnInit, ViewChildren, QueryList} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {ObjectStatusNetworkButtonItem} from "./objectstatusnetworkbuttonitem";

/**
 * a button to represent the ttaus network supporting moving items from one state to the next
 */
@Component({
    selector: 'object-status-network-button',
    templateUrl: './src/objectcomponents/templates/objectstatusnetworkbutton.html'
})
export class ObjectStatusNetworkButton implements OnInit {

    /**
     * a selector for the child items
     */
    @ViewChildren(ObjectStatusNetworkButtonItem) private buttonitemlist: QueryList<ObjectStatusNetworkButtonItem>;

    /**
     * the field that is status managed
     */
    private statusField: string = '';

    /**
     * the status network as retrieved from the config
     */
    private statusNetwork: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) {

    }

    /**
     * a getter to disable while editing or fi the user is not allowed to edit
     */
    get isDisabled() {
        return this.model.isEditing || !this.model.checkAccess('edit');
    }

    /**
     * cheks if the bean is managed at all
     */
    get isManaged() {
        return this.statusField != '' && this.primaryItem !== false && !this.isDisabled;
    }

    /**
     * returns the primary status item
     */
    get primaryItem() {
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {
                return statusnetworkitem;
            }
        }

        return false;
    }

    /**
     * a getter for all secoindray status items
     */
    get secondaryItems() {
        let retArray = [];
        let firstHit = false;
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {

                if (firstHit) {
                    retArray.push(statusnetworkitem);
                }

                if (!firstHit) firstHit = true;
            }
        }
        return retArray;
    }

    /**
     * loads the status network
     */
    public ngOnInit() {
        let statusmanaged = this.metadata.checkStatusManaged(this.model.module);
        if (statusmanaged != false) {
            this.statusField = statusmanaged.statusField;
            this.statusNetwork = statusmanaged.statusNetwork;
        }
    }

    /**
     * propagates the clisk to the item. This is handled on the LI level to enable a rpopr UX to allow clicking on the list and not the action item component
     *
     * @param actionid
     */
    private propagateclick(actionid) {
        this.buttonitemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                actionitem.setStatus(this.statusField);
                return true;
            }
        });
    }
}
