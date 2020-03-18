/**
 * @module ModuleTeleSales
 */
import {Component, OnDestroy, ViewChild} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {Subscription} from "rxjs";

@Component({
    templateUrl: './src/modules/telesales/templates/telesalescockpit.html',
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
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language,
                private model: model,
                private navigationtab: navigationtab,
                private telecockpitservice: telecockpitservice) {
        this.selectedListItemSubscriber();

        this.navigationtab.setTabInfo({displayname: 'Telesales'});
    }

    /**
     * unsubscribe
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private selectedListItemSubscriber() {
        this.subscriptions.add(this.telecockpitservice.selectedListItem$.subscribe(listItem => this.loadModel(listItem)));
    }

    private loadModel(selectedListItem) {
        this.model.reset();
        if (!selectedListItem) {
            return;
        }
        this.model.module = selectedListItem.target_type;
        this.model.id = selectedListItem.data.id;
        this.model.data = selectedListItem.data;
    }
}
