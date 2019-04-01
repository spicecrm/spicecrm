import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {configuration} from '../../groupware/services/configuration.service';
import {GroupwareService} from "../../groupware/services/groupware.service";


@Component({
    templateUrl: './src/include/outlook/templates/outlookroutehandler.html'
})
export class OutlookRouteHandler implements OnInit {

    constructor(
        private configuration: configuration,
        private groupware: GroupwareService,
        private router: Router,
    ) {

    }

    public ngOnInit(): void {
        console.log('handler init');
    }

}
