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
import {Component, AfterViewInit, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-relatedlist-duplicates',
    templateUrl: './src/objectcomponents/templates/objectrelatedduplicates.html'
})
export class ObjectRelatedDuplicates implements OnInit, OnDestroy {
    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * the loaded list of duplicates
     *
     * @private
     */
    private duplicates: any[] = [];

    /**
     * the complete duplicate count
     *
     * @private
     */
    private duplicatecount: number = 0;

    /**
     * the toggle to open or close the panel
     *
     * @private
     */
    private hideDuplicates: boolean = true;

    /**
     * indicates if we are loading
     *
     * @private
     */
    private isLoading: boolean = false;

    /**
     * holds component subscriptions
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private model: model, private broadcast: broadcast) {

    }

    /**
     * load the duplicates and subscribe to the broadcast
     */
    public ngOnInit() {
        // check duplicates
        this.checkDuplicates();

        // add a listener to the broadcast service
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => this.handleMessage(message))
        );
    }

    /**
     * handle the unsubscribe whenthe component is destroyed
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * hande the message and delete a duplicate if it has been merged
     *
     * @param message
     * @private
     */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'model.delete':
                if (message.messagedata.module == this.model.module) {
                    let dupIndex = this.duplicates.findIndex(d => d.id == message.messagedata.id);
                    if (dupIndex >= 0) {
                        this.duplicates.splice(dupIndex, 1);
                        this.duplicatecount--;
                    }
                }
                break;
        }
    }

    /**
     * toggle the panel open or closed
     *
     * @param e
     * @private
     */
    private toggleDuplicates(e: MouseEvent) {
        e.stopPropagation();
        this.hideDuplicates = !this.hideDuplicates;
    }

    /**
     * checks for duplicates
     *
     * @private
     */
    private checkDuplicates() {
        this.isLoading = true;
        this.model.duplicateCheck().subscribe(
            data => {
                this.duplicates = data.records;
                this.duplicatecount = data.count;
                this.isLoading = false;
            },
            error => {
                this.isLoading = false;
            }
        );
    }

    /**
     * used for the toggle icon
     */
    get iconStyle() {
        if (this.hideDuplicates) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }
}
