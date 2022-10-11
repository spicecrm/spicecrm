/**
 * @module ModuleDeployment
 */
import {Component, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';

/**
 * released packages cockpit view
 */
@Component({
    selector: 'deployment-system-packages-cockpit-view',
    templateUrl: '../templates/deploymentsystempackagescockpitview.html'
})
export class DeploymentSystemPackagesCockpitView implements OnInit {

    constructor(public backend: backend) {
    }

    public ngOnInit() {
        this.backend.getRequest('module/')
    }
}
