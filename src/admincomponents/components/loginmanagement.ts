/**
 * @module AdminComponentsModule
 */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LoginRestrictionIpAddresses } from './loginrestrictionipaddresses';

@Component({
    templateUrl: './src/admincomponents/templates/loginmanagement.html'
})
export class LoginManagement implements OnInit {

    @ViewChild('whiteList') public whiteListComponent: LoginRestrictionIpAddresses;
    @ViewChild('blackList') public blackListComponent: LoginRestrictionIpAddresses;

    constructor( private cdref: ChangeDetectorRef ) { }

    public ngOnInit() {
        // An additional change detection cycle because of sibling components LoginRestrictionIpAddresses.
        this.cdref.detectChanges();
    }

}
