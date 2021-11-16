/**
 * @module SpiceInstallerModule
 */

import {Component, Input} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-mysqli',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallermysqli.html'
})

export class SpiceinstallerMySQLi {
    /**
     * inputs from the parent component
     */
    @Input() private hostNameCondition: boolean;
    @Input() private userNameCondition: boolean;
    @Input() private dbNameCondition: boolean;

    constructor(
        private spiceinstaller: spiceinstaller
    ) {
        if(!this.spiceinstaller.db_port) this.spiceinstaller.db_port = '3306';
        if(!this.spiceinstaller.collation) this.spiceinstaller.collation = 'utf8mb4_general_ci';
        if(!this.spiceinstaller.db_name) this.spiceinstaller.db_name = this.spiceinstaller.systemname.toLowerCase().replace(/\s/g, '');
    }


}
