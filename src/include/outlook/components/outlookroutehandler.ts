import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GroupwareService} from "../../groupware/services/groupware.service";

/**
 * Outlook add-in route handler component.
 */
@Component({
    templateUrl: './src/include/outlook/templates/outlookroutehandler.html'
})
export class OutlookRouteHandler implements OnInit {

    constructor(
        private groupware: GroupwareService,
        private router: Router,
    ) {}

    public ngOnInit(): void {
        console.log('handler init');
    }

}
