/**
 * @module Outlook
 */
import {AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {footer} from "../../../services/footer.service";
import {ObjectActionContainerItem} from "../../../objectcomponents/components/objectactioncontaineritem";
import {loginService} from "../../../services/login.service";

/**
 * Footer component for the SpiceCRM Outlook add-in.
 * Used to show buttons with available actions.
 */
@Component({
    selector: 'outlook-pane-footer',
    templateUrl: '../templates/outlookpanefooter.html'
})
export class OutlookPaneFooter implements AfterViewInit, OnDestroy {
    /**
     * reference to the container item where the indivvidual components can be rendered into dynamically
     */
    @ViewChildren(ObjectActionContainerItem) public actionitemlist: QueryList<ObjectActionContainerItem>;

    @ViewChild('footer', {static: false}) public footerElement;

    public _currentroute: string = 'mailitem';
    /**
     * menu actions
     */
    public menuActions: any[] = [];
    /**
     * quick actions
     */
    public quickActions: any[] = [];

    constructor(
        public router: Router,
        public metadata: metadata,
        public language: language,
        public footer: footer,
        public loginService: loginService
    ) {
        this.getActions();
    }

    /**
     * Call an action.
     * @param action
     */
    public callAction(action) {
        this.actionitemlist.some(actionitem => {
            if (actionitem.id == action.id) {
                if (!actionitem.disabled) actionitem.execute();
                return true;
            }
        });
    }

    get currentroute() {
        return this._currentroute;
    }

    set currentroute(route) {
        if (route) {
            this._currentroute = route;
            this.router.navigate([route]);
        }
    }

    /**
     * A list of available actions.
     */
    private getActions() {
        let componentConfig = this.metadata.getComponentConfig('OutlookPane');
        if (componentConfig.actionset) {
            this.quickActions = this.metadata.getActionSetItems(componentConfig.actionset).filter(a => a.singlebutton == 1);
            this.menuActions = this.metadata.getActionSetItems(componentConfig.actionset).filter(a => a.singlebutton != 1);
        }
        return [];
    }

    /**
     * get the footer heigth and set it to the footer service
     */
    public ngAfterViewInit(): void {
        this.setFooterHeight();
    }

    /**
     * set the footer heigth to 0
     */
    public ngOnDestroy(): void {
        this.clearFooterHeight();
    }

    /**
     * calculates the height of the panel element and sets it to the footer service
     */
    public setFooterHeight() {
        let cRect = this.footerElement.nativeElement.getBoundingClientRect();
        this.footer.visibleFooterHeight = cRect.height;
    }

    /**
     * sets the footer height in the sevrice back to 0
     */
    public clearFooterHeight() {
        this.footer.visibleFooterHeight = 0;
    }
}
