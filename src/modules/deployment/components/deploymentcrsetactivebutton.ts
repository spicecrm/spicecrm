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
