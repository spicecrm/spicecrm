/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2, Input, ChangeDetectorRef, OnInit, NgZone} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {broadcast} from '../../services/broadcast.service';
import {helper} from '../../services/helper.service';
import {layout} from '../../services/layout.service';
import {ObjectActionContainer} from "./objectactioncontainer";
import {ObjectActionMenuItemI} from "../interfaces/objectcomponents.interfaces";

@Component({
    selector: 'object-action-menu',
    templateUrl: '../templates/objectactionmenu.html',
    providers: [helper]
})
export class ObjectActionMenu extends ObjectActionContainer implements OnInit {

    @Input() public buttonsize: string = '';

    @Input() public actionset: string = '';

    /**
     * an array with the action items.
     */
    public allActionItems: ObjectActionMenuItemI[] = [];

    /**
     * an array with the single action items
     * i.e. single button or button as icon
     */
    public singleitems: any[] = [];

    /**
     * an array with the NOT single action items
     */
    public dropdownItems: any[] = [];

    public componentconfig: any = {};

    /**
     * counts the number of single/icon buttons
     */
    public singleButtonSequence: number = 0;

    constructor(public language: language,
                public broadcast: broadcast,
                public model: model,
                public view: view,
                public metadata: metadata,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public helper: helper,
                public layout: layout,
                public cdRef: ChangeDetectorRef,
                public ngZone: NgZone) {
        super(language, metadata, model, ngZone, cdRef);
    }

    public ngOnInit() {
        if (this.actionset == "") {
            this.componentconfig = this.metadata.getComponentConfig('ObjectActionMenu', this.model.module);
            this.actionset = this.componentconfig.actionset_default;
            this.setActionsets();
        }
    }

    public ngOnChanges() {
        this.setActionsets();
    }

    public setActionsets() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);

        for (let actionitem of actionitems) {
            this.allActionItems.push({
                disabled: true,
                id: actionitem.id,
                sequence: actionitem.sequence,
                action: actionitem.action,
                component: actionitem.component,
                actionconfig: actionitem.actionconfig,
                singlebutton:  actionitem.singlebutton,
                displayasicon: actionitem.actionconfig?.displayasicon
            });
        }

        this.singleitems = [...this.allActionItems].filter(item => item.singlebutton == true || item.displayasicon == true);
        this.dropdownItems = [...this.allActionItems].filter(item => item.singlebutton == false && (item.displayasicon == false || item.displayasicon === undefined));

        // trigger Change detection to ensure the changes are renderd if cdref is on push mode on the parent component
        // happens amongst other scenarios in the list view
        this.cdRef.detectChanges();
    }

    /**
     * determines screen width: large/small
     */
    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    public getButtonSizeClass() {
        if (this.buttonsize !== '') {
            return 'slds-button--icon-' + this.buttonsize;
        }
    }

    /**
     * display buttons grouped only if we have a single button
     */
    public getGroupButtonClass(): string {

        const hiddenItems = this.singleitems.find(item => this.isHidden(item.id) == true);

        if (this.singleitems.length > 0 && this.allActionItems.length > 0 && hiddenItems == undefined && !this.isSmall) {
            return ' slds-button-group ';
        }
    }

    /**
     * determines based on the action ID if the component embedded in the container item is hidden
     * @param actionid the action id
     */
    public isHidden(actionid) {
        if (!this.stable) return false;

        let hidden = false;
        if (this.actionitemlist) {
            let actionitem = this.actionitemlist.find(actionitem => actionitem.id == actionid);
            if (actionitem) hidden = actionitem.hidden;
        }
        return hidden;
    }
}
