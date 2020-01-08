/**
 * @module AdminComponentsModule
 */
import {
    Component,
    Output,
    EventEmitter,
    ViewChild,
    ViewContainerRef,
    ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';
import {session} from '../../services/session.service';
import {administration} from "../services/administration.service";


@Component({
    selector: 'administration-menu',
    templateUrl: './src/admincomponents/templates/administrationmenu.html'
})
export class AdministrationMenu {

    private itemfilter: string = '';

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private broadcast: broadcast,
        private navigation: navigation,
        private elementref: ElementRef,
        private session: session,
        private administration: administration,
    ) {

    }


    private getNavigationBlocks() {
        let blocks = [];
        for (let block in this.administration.adminNavigation) {

            let isRelevant = this.itemfilter == '';

            // check if we find an item
            if (!isRelevant) {
                this.administration.adminNavigation[block].some(item => {
                    let name = item.adminaction;
                    if (item.admin_label) {
                        name = this.language.getLabel(item.admin_label);
                    }
                    if (name.toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0) {
                        isRelevant = true;
                        return true;
                    }
                });
            }

            if (isRelevant) {
                blocks.push(block);
            }

        }
        return blocks.sort();
    }

    private getNavigationItems(block) {
        let items = [];

        for (let item of this.administration.adminNavigation[block]) {
            if ( item.componentconfig.onlyForDevs && !this.session.isDev ) continue;
            item.name = item.adminaction;
            if (item.admin_label) {
                item.name = this.language.getLabel(item.admin_label);
            }

            if (this.itemfilter == '' || item.name.toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0) {
                items.push(item);
            }

        }

        return items;
    }

    /**
     * emit nav changes to main screen
     *
     * @param item
     */
    private openContent(block, item) {
        // already loaded?
        if (this.administration.opened_itemid == item.id) {
            return true;
        }

        this.administration.opened_itemid = item.id;

        this.administration.navigateto(block, item);
    }

}
