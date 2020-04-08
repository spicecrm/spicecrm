/**
 * @module Outlook
 */
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {footer} from "../../../services/footer.service";

/**
 * Footer component for the SpiceCRM Outlook add-in.
 * Used to show buttons with available actions.
 */
@Component({
    selector: 'groupware-detail-pane-footer',
    templateUrl: './src/include/groupware/templates/groupwaredetailpanefooter.html'
})
export class GroupwareDetailPanefooter implements AfterViewInit, OnDestroy {

    @ViewChild('footer', {static: false}) private footerElement;

    private _currentroute: string = 'groupware/mailitem';

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        private footer: footer,
        private elementRef: ElementRef
    ) {
    }

    public ngAfterViewInit(): void {
        this.setFooterHeight();
    }

    public ngOnDestroy(): void {
        this.clearFooterHeight();
    }

    /**
     * calculates the height of the panel element and sets it to the footer service
     */
    private setFooterHeight() {
        let cRect = this.footerElement.nativeElement.getBoundingClientRect();
        this.footer.visibleFooterHeight = cRect.height;
    }

    /**
     * sets the footer height in the sevrice back to 0
     */
    private clearFooterHeight() {
        this.footer.visibleFooterHeight = 0;
    }

    /**
     * Call an action.
     * @param action
     */
    private callAction(action) {
        this.router.navigate([action.actionconfig.route]);
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
    get actions() {
        let componentConfig = this.metadata.getComponentConfig('OutlookPane');
        if (componentConfig.actionset) {
            return this.metadata.getActionSetItems(componentConfig.actionset);
        }
        return [];
    }
}
