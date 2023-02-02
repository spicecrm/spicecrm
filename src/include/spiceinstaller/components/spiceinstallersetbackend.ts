/**
 * @module SpiceInstaller
 */

import { Component, Input, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";
import {stepObject} from "../services/spiceinstaller.service";

@Component({
    selector: 'spice-installer-set-backend',
    templateUrl: '../templates/spiceinstallersetbackend.html',
})

export class SpiceInstallerSetBackEnd implements OnInit {

    @Input() public selfStep: stepObject;

    public checking: boolean = false;
    public apiurl: string = "";
    public apiFound: boolean = false;

    public systemNameCondition = true;

    constructor(
        public toast: toast,
        public http: HttpClient,
        public router: Router,
        public configurationService: configurationService,
        public spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.jumpSubject.subscribe( fromTo => {
            if ( !fromTo.to ) return;
            if ( fromTo.from === this.selfStep ) {
                if ( this.selfStep.completed || fromTo.to.pos < this.selfStep.pos || this.tryComplete() ) this.spiceinstaller.jump( fromTo.to );
            }
        });
    }

    /**
     * gets the current url and checks if there is an api folder, hides all the properties for the backendconfig object except systemname
     */
    public ngOnInit() {
        let currentUrl = window.location.href;
        this.apiurl = currentUrl.replace("#/install", "api");
    }

    public tryComplete(): boolean {
        this.systemNameCondition = this.spiceinstaller.systemname?.length > 0;
        if ( !this.systemNameCondition ) return false;
        this.spiceinstaller.systemurl = this.apiurl;
        this.spiceinstaller.configObject.backendconfig = {
            backendUrl: this.spiceinstaller.systemurl,
            frontendUrl: this.spiceinstaller.frontendUrl,
        };
        this.selfStep.completed = true;
        return true;
    }

}
