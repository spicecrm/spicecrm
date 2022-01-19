import {Component, Input, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {trigger, transition, animate, style, state} from '@angular/animations';

@Component({
    selector: "[serviceorder-effort-item-details]",
    templateUrl: "../templates/serviceordereffortitemdetails.html",
    providers: [view],
    animations: [
        trigger('slideInOut', [
            state('open', style({height: '80px'})),
            state('closed', style({height: '0px'})),
            transition('open <=> closed', [
                animate('200ms')
            ])
        ])
    ]
})
export class ServiceOrderEffortItemDetails implements OnInit  {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    /**
     * the serviceorder model
     */
    @Input() public serviceorder: any = {};

    /**
     * the view fromt eh parent .. to link the two
     */
    @Input() public parentview: view;

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    constructor(
        public metadata: metadata,
        public language: language,
        public model: model,
        public view: view
    ) {
    }

    public ngOnInit(): void {
        this.viewSubscriptions();
        this.setConfig();
    }

    /**
     * view mode subscriptions (manage edit/view mode)
     */
    public viewSubscriptions() {
        // link the two views

        this.view.displayLabels = false;

        this.view.isEditable = this.parentview.isEditable;
        this.view.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.parentview.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                this.parentview.setEditMode();
                this.parentview.displayLinks = false;
            }
        });
        this.parentview.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.view.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                this.view.setEditMode();
                this.view.displayLinks = false;
            } else {
                this.view.setViewMode();
                this.view.displayLinks = true;
            }
        });
    }


    /**
     * set the configuration
     */
    public setConfig() {
        let config = this.metadata.getComponentConfig('ServiceOrderEffortPanel', this.serviceorder.module);
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetItems(config.detail_fieldset);
        }
    }

    /**
     * returns true if we are in edit mode
     */
    get editing() {
        return this.view.isEditMode();
    }

    /**
     * getter for the icon of the exoanded section
     *
     * ToDo: change to animation
     */
    get toggleIcon() {
        return this.item.expanded ? 'chevronup' : 'chevrondown';
    }

    /**
     * toggels the expanded flag and shows the details or hides them
     */
    public toggleDetails() {
        this.item.expanded = !this.item.expanded;
    }

}
