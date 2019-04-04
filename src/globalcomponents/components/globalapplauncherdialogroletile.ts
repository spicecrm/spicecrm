/**
 * @module GlobalComponents
 */
import {Component, ElementRef, ViewChild, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-app-launcher-dialog-role-tile',
    templateUrl: './src/globalcomponents/templates/globalapplauncherdialogroletile.html'
})
export class GlobalAppLauncherDialogRoleTile implements OnInit {

    @Input() private role;

    private name: string;
    private identifier: string;
    private description: string;
    private descriptionfull: string;

    constructor(
        private language: language,
        private metadata: metadata,
    ) {

    }

    public ngOnInit() {
        this.buildRoleLabels();
    }

    private buildRoleLabels() {
        this.metadata.getRoles().some((role) => {
            if (role.id == this.role.id) {
                this.identifier = this.language.getAppLanglabel(role.label, 'short');
                this.name = this.language.getAppLanglabel(role.label);
                this.description = this.language.getAppLanglabel(role.label, 'long');
                if ( this.name === this.description ) this.description = null; // Don´t output the same string twice.

                if (this.description && this.description.length > 75) {
                    this.descriptionfull = this.description;
                    this.description = this.description.substr(0, 75) + '...';
                }
                return true;
            }
        });
    }

}
