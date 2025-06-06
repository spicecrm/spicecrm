/**
 * @module ModuleCampaigns
 */
import {
    Component, OnDestroy, OnInit, Optional, ViewChild, ViewContainerRef
} from '@angular/core';
import {Params, Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {metadata} from "../../../services/metadata.service";
import {layout} from "../../../services/layout.service";

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
    standalone: false
})
export class CampaignTaskTargetsManagerButton {
    constructor(public model: model,
                public router: Router,
                public metadata: metadata,
                public layout: layout,
                @Optional() public navigationtab: navigationtab) {
    }

    /**
     * disabled if the user does not have acl edit on target lists or on small screen or CampaignTask activated true
     */
    get disabled(): boolean {
        return !this.metadata.checkModuleAcl(this.model.module, 'target_manager') || this.layout.screenwidth == 'small' || this.model.data.activated;
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
