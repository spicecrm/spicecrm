/**
 * @module WorkbenchModule
 */
import { Component, ViewChild } from '@angular/core';
import { LoginRestrictionIpAddresses } from './loginrestrictionipaddresses';

/**
 * @ignore
 */
declare var _: any;

@Component({
    templateUrl: './src/admincomponents/templates/loginmanagement.html'
})
export class LoginManagement {

    @ViewChild('whiteList') public whiteListComponent: LoginRestrictionIpAddresses;
    @ViewChild('blackList') public blackListComponent: LoginRestrictionIpAddresses;

    // constructor() { }

}
