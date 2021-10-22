/**
 * @module AdminComponentsModule
 */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AdministrationLoginRestrictionIpAddresses } from './administrationloginrestrictionipaddresses';

@Component({
    templateUrl: './src/admincomponents/templates/administrationloginmanagement.html'
})
export class AdministrationLoginManagement implements OnInit {

    @ViewChild('whiteList') public whiteListComponent: AdministrationLoginRestrictionIpAddresses;
    @ViewChild('blackList') public blackListComponent: AdministrationLoginRestrictionIpAddresses;

    constructor( private cdref: ChangeDetectorRef ) { }

    public ngOnInit() {
        // An additional change detection cycle because of sibling components LoginRestrictionIpAddresses.
        this.cdref.detectChanges();
    }

}
