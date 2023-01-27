/**
 * @module ModuleCampaigns
 */
import {
    Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, Input
} from '@angular/core';
import { Params} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * allows management of targets in multiple targetlists on a campaigntask
 */
@Component({
    selector: 'campaigntask-target-manager-details',
    templateUrl: '../templates/campaigntasktargetsmanagerdetails.html',
    providers: [model, view]
})
export class CampaignTaskTargetsManagerDetails implements OnInit {
    /**
     * the module
     */
    @Input() public module: string;

    /**
     * the model data
     */
    @Input() public data: any;

    /**
     * the model data
     */
    @Input() public fieldset: string;

    constructor(public metadata: metadata, public modal: modal, public model: model, public view: view) {

        // hide labels
        this.view.displayLabels = false;
    }

    public ngOnInit(): void {
        // initialize the model
        this.model.module = this.module;
        this.model.data = this.model.utils.backendModel2spice(this.module, this.data);
    }

}
