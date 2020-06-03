/**
 * @module ModuleGSuite
 */
import {AfterViewInit, Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {footer} from "../../../services/footer.service";
import {GroupwareService} from "../../../include/groupware/services/groupware.service";
import {GSuiteGroupware} from "../services/gsuitegroupware.service";

/**
 * Footer component for the SpiceCRM GSuite add-in.
 * Used to show buttons with available actions.
 */
@Component({
    selector: 'gsuite-pane-footer',
    templateUrl: './src/include/gsuite/templates/gsuitepanefooter.html'
})
export class GSuitePaneFooter implements AfterViewInit, OnDestroy {

    @ViewChild('footer', {static: false}) private footerElement;

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        @Inject(GroupwareService) private groupware: GSuiteGroupware,
        private footer: footer
    ) {
    }

    private _currentroute: string = 'mailitem';

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
        let componentConfig = this.metadata.getComponentConfig('GSuitePane');
        if (componentConfig.actionset) {
            return this.metadata.getActionSetItems(componentConfig.actionset);
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
     * Call an action.
     * @param action
     */
    private callAction(action) {
        if (!this.groupware.threadId) return;
        this.router.navigate([action.actionconfig.route]);
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
}
