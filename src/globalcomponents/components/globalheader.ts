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
 * @module GlobalComponents
 */
import {
    Component,
    ViewChild, ViewContainerRef
} from '@angular/core';
import {toast} from '../../services/toast.service';
import {session} from '../../services/session.service';
import {navigation} from '../../services/navigation.service';
import {layout} from '../../services/layout.service';
import {ActivationStart, Router} from '@angular/router';
import {configurationService} from '../../services/configuration.service';

declare var _: any;

/**
 * renders the global header bar
 * a central component on teh spiceui
 */
@Component({
    selector: 'global-header',
    templateUrl: './src/globalcomponents/templates/globalheader.html'
})
export class GlobalHeader {

    /**
     * reference to the header to get the height
     */
    @ViewChild('header', {read: ViewContainerRef, static: false}) private header: ViewContainerRef;

    constructor(private session: session, private router: Router, private toast: toast, private layout: layout, private navigation: navigation, private configurationService: configurationService) {

        // ToDo: check what this is doing here
        this.router.events.subscribe((val: any) => {
            if (val instanceof ActivationStart) {
                // CR1000463: use spiceacl to enable listing and access foreign user records
                // keep BWC for old modules/ACL/ACLController.php
                let _aclcontroller = this.configurationService.getSystemParamater('aclcontroller');
                if (_aclcontroller && _aclcontroller != 'spiceacl' && val.snapshot.params.module === 'Users' && val.snapshot.params.id) {
                    if (!this.session.authData.admin && val.snapshot.params.id != this.session.authData.userId) {
                        this.toast.sendToast('You are not allowed to view or edit foreign user data.', 'warning', null, 3);
                        this.router.navigate(['/module/Users']);
                    }
                }
            }
        });

    }

    /**
     * a getter for the header height
     */
    get headerHeight() {
        if (this.header) {
            return this.header.element.nativeElement.getBoundingClientRect().height;
        } else {
            return 0;
        }
    }

    /**
     * returns true if the navigation paradigm is tabbed or subtabbed
     */
    get tabbed() {
        return this.navigation.navigationparadigm == 'tabbed' || this.navigation.navigationparadigm == 'subtabbed';
    }

    /**
     * returns if the view is considered small
     */
    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * cheks if we have tenant data set and thus shoudl render the tenant bar
     */
    get isTenant() {
        return !_.isEmpty(this.configurationService.getData('tenantconfig'));

    }
}

