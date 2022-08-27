/**
 * @module ModuleCampaigns
 */
import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {DomSanitizer} from "@angular/platform-browser";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'campaign-task-email-panel',
    templateUrl: '../templates/campaigntaskmailmergepanel.html'
})
export class CampaignTaskMailMergePanel implements OnInit, OnDestroy {
    /**
     * holds the component config set from the workbench
     */
    public componentconfig: any = {};

    /**
     * holds the active tab value
     */
    public activeTab: 'details' | 'preview' = 'details';


    /**
     * holds a subscription to be unsubscribed on destroy
     */
    public subscription = new Subscription();

    constructor(public language: language,
                public model: model,
                public injector: Injector,
                public view: view,
                public sanitizer: DomSanitizer,
                public backend: backend,
                public metadata: metadata,
                public modal: modal
    ) {
    }

    /**
     * @return matchedModelState: boolean
     */
    get hidden() {
        return this.model.getField('campaigntask_type') != 'mailmerge';
    }

    /**
     * call to set the sanitized html value
     */
    public ngOnInit() {
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    /**
     * set the activeTab
     */
    public setActiveTab(tab) {
        this.activeTab = tab;
    }
}
