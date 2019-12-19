/**
 * @module AdminComponentsModule
 */
import {
    Component,
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
import { AdminHomeScreen } from './adminhomescreen';

@Component({
    selector: '[administration-menu]',
    templateUrl: './src/admincomponents/templates/administrationmenu.html'
})
export class AdministrationMenu implements OnDestroy {

    @ViewChild('admincontentcontainer', {read: ViewContainerRef, static: true}) private admincontentcontainer: ViewContainerRef;
    @ViewChild('adminhomecontainer', {read: ViewContainerRef, static: true}) private adminhomecontainer: ViewContainerRef;

    private admincontentObject: any = null;
    private adminNavigation: any = {};
    private itemfilter: string = '';
    private opened_itemid: any = {};
    private hidden: boolean = false;

    private broadcastsubscription: any;

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private broadcast: broadcast,
        private navigation: navigation,
        private elementref: ElementRef,
        private session: session,
    ) {
        this.loadNavigation();
        this.navigation.setActiveModule('Administration');

        this.broadcastsubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    public ngOnDestroy() {
        this.broadcastsubscription.unsubscribe();
    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'loader.reloaded':
                this.loadNavigation();
                break;
        }
    }

    private loadNavigation() {
        this.backend.getRequest('spiceui/admin/navigation').subscribe(
            nav => {
                this.adminNavigation = nav;
                // default open version control...
                // this.openContent('Versioning', 'Version Control');
            },

        );

    }

    private getContainerStyle() {
        return {
            height: 'calc(100vh - ' + this.elementref.nativeElement.offsetTop + 'px)'
        };
    }

    private getNavigationBlocks() {
        let blocks = [];
        for (let block in this.adminNavigation) {

            let isRelevant = this.itemfilter == '';

            // check if we find an item
            if (!isRelevant) {
                this.adminNavigation[block].some(item => {
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

        for (let item of this.adminNavigation[block]) {
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

    private openContent(block: string, item) {
        this.hidden = true;
        window.console.log(this.hidden);
        // already loaded?
        if (this.opened_itemid == item.id) {
            return true;
        }

        this.opened_itemid = item.id;
        if (this.admincontentObject) {
            this.admincontentObject.destroy();
        }

        let adminItem: any = {};

        if (!this.adminNavigation[block]) {
            return false;
        }

        this.adminNavigation[block].some(blockAction => {
                if (blockAction.id == item.id) {
                    adminItem = blockAction;
                    return true;
                }
            }
        );

        if (adminItem.component) {
            // this.router.navigate(['admin/'+block+'/'+item.adminaction]);
            this.metadata.addComponent(adminItem.component, this.admincontentcontainer).subscribe(admObject => {
                admObject.instance.componentconfig = adminItem.componentconfig;
                this.admincontentObject = admObject;
            });
        }
    }

    private loadHome() {
        this.metadata.addComponent('AdminHomeScreen', this.adminhomecontainer);
        window.console.log(this.hidden);
    }

    public ngAfterViewInit() {
        this.loadHome();
    }

}
