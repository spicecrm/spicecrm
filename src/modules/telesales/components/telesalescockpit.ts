/**
 * @module ModuleTeleSales
 */
import {Component, OnDestroy, ViewChild} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {Subscription} from "rxjs";
import {TeleSalesCockpitMain} from "./telesalescockpitmain";
import {TeleSalesCockpitList} from "./telesalescockpitlist";

@Component({
    templateUrl: './src/modules/telesales/templates/telesalescockpit.html',
    providers: [
        telecockpitservice,
        view,
        model
    ]
})

export class TeleSalesCockpit implements OnDestroy {

    @ViewChild(TeleSalesCockpitMain, {static: true}) private mainComponent: TeleSalesCockpitMain;
    @ViewChild(TeleSalesCockpitList, {static: true}) private listComponent: TeleSalesCockpitList;

    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private model: model,
                private telecockpitservice: telecockpitservice) {
        this.selectedListItemSubscriber();
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private selectedListItemSubscriber() {
        this.subscription = this.telecockpitservice.selectedListItem$.subscribe(listItem => this.loadModel(listItem));
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
