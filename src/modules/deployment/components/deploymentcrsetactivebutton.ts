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
 * @module ModuleDeployment
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {broadcast} from '../../../services/broadcast.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {Subscription} from "rxjs";

/**
 * renders a button in an actionset that can activate a CR in the system
 */
@Component({
    templateUrl: './src/modules/deployment/templates/deploymentcrsetactivebutton.html'
})
export class DeploymentCRSetActiveButton {

    /**
     * the active id
     */
    private activeID = '';

    constructor(private language: language, private backend: backend, private model: model, private toast: toast, private broadcast: broadcast) {
        this.backend.getRequest('systemdeploymentcrs/active').subscribe(crresponse => {
            this.activeID = crresponse.id;
        });
    }

    /**
     * a simple getter to check if the current CR is active
     */
    get isActive() {
        return this.model.id == this.activeID;
    }

    /**
     * execute and set active or inactive
     */
    public execute() {
        if (this.isActive) {
            this.backend.deleteRequest('systemdeploymentcrs/active').subscribe(status => {
                this.activeID = '';
                this.broadcast.broadcastMessage('cr.clearactive', {
                    module: this.model.module,
                });
            });
        } else {
            this.backend.postRequest('systemdeploymentcrs/active/' + this.model.id).subscribe(status => {
                if (status.status == 'success') {
                    this.activeID = this.model.id;

                    this.broadcast.broadcastMessage('cr.setactive', {
                        module: this.model.module,
                        id: this.model.id,
                        name: this.model.data.name
                    });
                }
            });
        }
    }

    /**
     * get the disabled state
     */
    get disabled() {
        // not active when editing
        if (this.model.isEditing) return true;

        // check if we are active or in process
        return this.isActive || this.model.getFieldValue('crstatus') == '1' ? false : true;
    }
}
