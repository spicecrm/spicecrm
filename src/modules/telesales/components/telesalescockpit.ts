/**
 * @module ModuleTeleSales
 */
import {Component, OnDestroy} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'telesales-cockpit',
    templateUrl: '../templates/telesalescockpit.html',
    providers: [
        telecockpitservice,
        view,
        model
    ]
})

export class TeleSalesCockpit implements OnDestroy {

    /**
     * handles the subscriptions for the component
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public language: language,
                public model: model,
                public navigationtab: navigationtab,
                public telecockpitservice: telecockpitservice) {
        this.selectedListItemSubscriber();

        this.navigationtab.setTabInfo({displayname: 'Telesales'});
    }

    /**
     * unsubscribe
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public selectedListItemSubscriber() {
        this.subscriptions.add(this.telecockpitservice.selectedListItem$.subscribe(listItem => this.loadModel(listItem)));
    }

    public loadModel(selectedListItem) {
        this.model.reset();
        if (!selectedListItem) {
            return;
        }
        this.model.module = selectedListItem.target_type;
        this.model.id = selectedListItem.data.id;
        this.model.setData(selectedListItem.data);
    }
}
