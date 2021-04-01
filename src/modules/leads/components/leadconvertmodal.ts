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
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Observable, Subject} from "rxjs";

/**
 * a separet modal to display the steps for th elad comversion as well as the progress
 */
@Component({
    selector: 'lead-convert-modal',
    templateUrl: './src/modules/leads/templates/leadconvertmodal.html'
})
export class LeadConvertModal implements OnInit {

    /**
     * reference to the modal itsefl
     */
    private self: any;

    /**
     * the actions to be performed
     */
    @Input() private saveactions: any[] = [];

    /**
     * an event emiter emitting when the conversion was completed
     */
    @Output() private completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private language: language) {

    }

    public ngOnInit(): void {
        this.processConvertActions();
    }

    /**
     * simple function to return the status icon based on the status of the step
     *
     * @param status
     */
    private getStatusIcon(status) {
        switch (status) {
            case 'initial':
                return 'clock';
            case 'completed':
                return 'check';
        }
    }

    /**
     * processes the convert action recursively
     */
    private processConvertActions() {
        let nextAction = '';
        this.saveactions.some(item => {
            if (item.status === 'initial') {
                nextAction = item;
                return true;
            }
        });

        if (nextAction) {
            this.processConvertAction(nextAction);
        } else {
            this.completed.emit(true);
            this.self.destroy();
        }
    }

    /**
     * processes one action with the save and then calls the process action again
     * until all actions are completed
     *
     * @param item
     */
    private processConvertAction(item) {
        item.model.save().subscribe(data => {
            item.model.data = item.model.utils.backendModel2spice(item.model.module, data);
            this.completeConvertAction(item.action);
        });
    }

    /**
     * sets the convert action to completed and processes the next one
     *
     * @param action
     */
    private completeConvertAction(action) {
        this.saveactions.find(item => item.action === action).status = 'completed';

        // start the next step
        this.processConvertActions();
    }
}
