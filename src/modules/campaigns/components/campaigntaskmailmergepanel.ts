/**
 * @module ModuleCampaigns
 */
import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'campaign-task-email-panel',
    templateUrl: './src/modules/campaigns/templates/campaigntaskmailmergepanel.html'
})
export class CampaignTaskMailMergePanel implements OnInit, OnDestroy {
    /**
     * holds the component config set from the workbench
     */
    private componentconfig: any = {};

    /**
     * holds the active tab value
     */
    private activeTab: 'details' | 'preview' = 'details';


    /**
     * holds a subscription to be unsubscribed on destroy
     */
    private subscription = new Subscription();

    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private sanitizer: DomSanitizer,
                private backend: backend,
                private metadata: metadata,
                private modal: modal
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
    private setActiveTab(tab) {
        this.activeTab = tab;
    }

}
