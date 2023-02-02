/**
 * @module ModuleCampaigns
 */
import {
    Component, OnDestroy, OnInit, Optional, ViewChild, ViewContainerRef
} from '@angular/core';
import {Params, Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {navigationtab} from '../../../services/navigationtab.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * renders a button that routes to the targets manager
 */
@Component({
    selector: 'campaigntask-target-manager-button',
    templateUrl: '../templates/campaigntasktargetsmanagerbutton.html',
})
export class CampaignTaskTargetsManagerButton {
    constructor(public model: model, public router: Router, @Optional() public navigationtab: navigationtab) {
    }

    /**
     * cancel and destroy the modal if we have one
     */
    public execute() {
        let routeprefix = '';
        if (this.navigationtab?.tabid) {
            routeprefix = '/tab/' + this.navigationtab.tabid
        }
        this.router.navigate([routeprefix + "/module/" + this.model.module + "/manage/" + this.model.id]);
    }
}
