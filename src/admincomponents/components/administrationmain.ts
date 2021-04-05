/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
