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
    templateUrl: '../templates/administrationmain.html',
    providers: [administration]
})
export class AdministrationMain implements AfterViewInit {

    /**
     * the right hand side container that is populated dynamically
     */
    @ViewChild('admincontentcontainer', {
        read: ViewContainerRef,
        static: true
    }) public admincontentcontainer: ViewContainerRef;

    /**
     * the currently opened and renders Object
     */
    public admincontentObject: any = null;

    constructor(
        public administration: administration,
        public metadata: metadata,
        public language: language,
        public navigation: navigation,
        public navigationtab: navigationtab,
    ) {
        this.navigationtab.setTabInfo({
            displayname: this.language.getLabel('LBL_ADMINISTRATION'),
            displayicon: 'settings'
        });
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
     * returns the width for the menu bar
     */
    get menuWidth(){
        return {
            'width': this.administration.minimized ? '40px' : '220px',
            'min-width': this.administration.minimized ? '40px' : '220px',
        }
    }

    /**
     * handle nav changes
     *
     * @param event
     */
    public openContent(admincomponent) {

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
