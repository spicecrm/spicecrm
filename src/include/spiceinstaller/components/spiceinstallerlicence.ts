/**
 * @module SpiceInstallerModule
 */

import { Component, Input } from '@angular/core';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-licence',
    templateUrl: '../templates/spiceinstallerlicence.html'
})

export class SpiceInstallerLicence {

    @Input() public selfStep: stepObject;

    public year: any = new Date();
    public author: string = '';

    constructor(
        public spiceinstaller: spiceinstaller
    ) {
        this.author = 'SpiceCRM';
        this.year = this.year.getFullYear();
        this.spiceinstaller.jumpSubject.subscribe( fromTo => {
            if ( !fromTo.to ) return;
            if ( fromTo.from === this.selfStep ) {
                if ( this.selfStep.completed || fromTo.to?.pos < this.selfStep.pos ) this.spiceinstaller.jump( fromTo.to );
            }
        });
    }

}
