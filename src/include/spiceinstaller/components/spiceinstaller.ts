/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";
import {configurationService} from '../../../services/configuration.service';
import {Router} from '@angular/router';

@Component({
    selector: 'spice-installer',
    templateUrl: '../templates/spiceinstaller.html',
    providers: [spiceinstaller]
})

export class SpiceInstaller {

    constructor(
        public spiceinstaller: spiceinstaller,
        public configuration: configurationService,
        private router: Router
    ) {
        // make sure the config service made this call and the router is there
        if(!this.configuration.enableinstall){
            router.navigate(['']);
        }
    }
}
