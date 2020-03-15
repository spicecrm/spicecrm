/**
 * @module AdminComponentsModule
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef, OnDestroy, AfterViewInit
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {navigationtab} from '../../services/navigationtab.service';
import {administration} from '../services/administration.service';


@Component({
    templateUrl: './src/admincomponents/templates/administrationmain.html',
    providers: [administration]
})
export class AdministrationMain implements AfterViewInit {

    /**
     * the right hand side container that is populated dynamically
     */
    @ViewChild('admincontentcontainer', {
        read: ViewContainerRef,
        static: true
    }) private admincontentcontainer: ViewContainerRef;

    /**
     * the currently opened and renders Object
     */
    private admincontentObject: any = null;

    constructor(
        private administration: administration,
        private metadata: metadata,
        private language: language,
        private navigation: navigation,
        private navigationtab: navigationtab,
    ) {
        // this.navigation.setActiveModule('Administration');
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_ADMINISTRATION'), displayicon: 'settings'});
    }

    /**
     * render the default home screen after view init
     */
    public ngAfterViewInit(): void {
        this.administration.admincomponent$.subscribe(admincomponent => {
            this.openContent(admincomponent);
        });

    }

    /**
     * handle nav changes
     *
     * @param event
     */
    private openContent(admincomponent) {

        if (this.admincontentObject) {
            this.admincontentObject.destroy();
        }

        // this.router.navigate(['admin/'+block+'/'+item.adminaction]);
        this.metadata.addComponent(admincomponent.component, this.admincontentcontainer).subscribe(admObject => {
            admObject.instance.componentconfig = admincomponent.componentconfig;
            this.admincontentObject = admObject;
        });


    }
}
