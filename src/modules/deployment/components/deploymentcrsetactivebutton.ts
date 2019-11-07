/**
 * @module ModuleDeployment
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {broadcast} from '../../../services/broadcast.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';

/**
 * renders a button in an actionset that can activate a CR in the system
 */
@Component({
    templateUrl: './src/modules/deployment/templates/deploymentcrsetactivebutton.html'
})
export class DeploymentCRSetActiveButton implements OnInit {

    /**
     * the active id
     */
    private activeID = '';

    /**
     * to set the button disabled
     */
    public disabled: boolean = false;

    constructor(private language: language, private backend: backend, private model: model, private toast: toast, private broadcast: broadcast) {
        this.backend.getRequest('systemdeploymentcrs/active').subscribe(crresponse => {
            this.activeID = crresponse.id;
        });
    }

    public ngOnInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    get isActive() {
        return this.model.id == this.activeID;
    }

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

    private handleDisabled(mode) {
        this.disabled = this.model.getFieldValue('crstatus') != '3' ? false : true;
    }

}