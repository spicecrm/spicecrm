/**
 * @module ModuleGSuite
 */
import {Component, Inject, OnInit} from '@angular/core';
import {session} from "../../../services/session.service";
import {Router} from "@angular/router";
import {broadcast} from "../../../services/broadcast.service";
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {GSuiteBrokerService} from "../services/gsuitebroker.service";
import {GSuiteGroupware} from "../services/gsuitegroupware.service";

/**
 * Main container for the SpiceCRM GSuite add-in. This gets rendered by the loader.
 * The pane intializes the mailbox and the groupware services. Then it loads the UI and starts the config process
 * if no user and password is set in the store it loads the settings route
 */
@Component({
    selector: 'gsuite-pane-default',
    templateUrl: '../templates/gsuitepanedefault.html'
})
export class GSuitePaneDefault {
}
