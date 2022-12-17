/**
 * @module SpiceInstallerModule
 */

import {Component, Input} from '@angular/core';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";

@Component({
    selector: 'spice-installer-pgsql',
    templateUrl: '../templates/spiceinstallerpgsql.html'
})
export class SpiceinstallerPostgreSQL {

    /**
     * inputs from the parent component
     */
    @Input() public selfStep: stepObject;
    @Input() public hostNameCondition: boolean;
    @Input() public userNameCondition: boolean;
    @Input() public dbNameCondition: boolean;

    constructor( public spiceinstaller: spiceinstaller ) { }

}
