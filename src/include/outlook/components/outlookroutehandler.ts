/**
 * @module Outlook
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {GroupwareService} from "../../../include/groupware/services/groupware.service";

/**
 * Route handler for the SpiceCRM Outlook add-in.This is a pure helkper component that catches the initial load and either send the use
 * to the login or the settings pane
 */
@Component({
    templateUrl: './src/include/outlook/templates/outlookroutehandler.html'
})
export class OutlookRouteHandler {

    constructor(
        private groupware: GroupwareService,
        private router: Router,
    ) {}

}
