/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';

@Component({
    selector: '[admin-home-screen]',
    templateUrl: './src/admincomponents/templates/adminhomescreen.html'
})

export class AdminHomeScreen {
    private adminHomeMenu: any = {};

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        private backend: backend
    ) {
        this.loadHomeMenu();
    }

    private loadHomeMenu() {
        this.backend.getRequest('spiceui/admin/homemenu').subscribe(
            response => {
                this.adminHomeMenu = response;
                // window.console.log(this.adminHomeMenu);
            }
        );
    }
}
