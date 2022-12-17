/**
 * @module SpiceInstallerModule
 */

import {Component, Input} from '@angular/core';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";

@Component({
    selector: 'spice-installer-mysqli',
    templateUrl: '../templates/spiceinstallermysqli.html'
})
export class SpiceinstallerMySQLi {

    /**
     * inputs from the parent component
     */
    @Input() public selfStep: stepObject;
    @Input() public hostNameCondition: boolean;
    @Input() public userNameCondition: boolean;
    @Input() public dbNameCondition: boolean;

    constructor( public spiceinstaller: spiceinstaller ) {
        if(!this.spiceinstaller.db_port) this.spiceinstaller.db_port = '3306';
        if(!this.spiceinstaller.collation) this.spiceinstaller.collation = 'utf8mb4_general_ci';
        if(!this.spiceinstaller.db_name) this.spiceinstaller.db_name = this.spiceinstaller.systemname.toLowerCase().replace(/\s/g, '');
    }

}
