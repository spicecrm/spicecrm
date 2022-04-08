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
    templateUrl: '../templates/globalheader.html'
})
export class GlobalHeader {

    /**
     * reference to the header to get the height
     */
    @ViewChild('header', {read: ViewContainerRef, static: false})public header: ViewContainerRef;

    constructor(public session: session,public router: Router,public toast: toast,public layout: layout,public navigation: navigation,public configurationService: configurationService) {

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

