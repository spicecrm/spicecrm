/**
 * @module GlobalComponents
 */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { userpreferences } from '../../services/userpreferences.service';
import { session } from '../../services/session.service';
import { toast } from '../../services/toast.service';

/**
 * @ignore
 */
declare var _: any;
declare var moment: any;

/**
 *
 */
@Component({
    selector: 'global-obtin-important-preferences',
    templateUrl: './src/globalcomponents/templates/globalobtainimportantpreferences.html',
})
export class GlobalObtainImportantPreferences implements OnInit {

    private self: any;
    private componentId = _.uniqueId();

    @Input() public namesOfMissingPrefs: string[] = [];
    @Input() public timeshift = 0;

    private preferences: any = {};
    private timezones: object;
    private timezoneKeys: string[];
    private navigateToUserPrefs = false;

    private guessedTimezone = moment.tz.guess();
    private guessedTimezoneGmtDiff = moment.tz(this.guessedTimezone).format('Z');
    private configuredTimezone: string;
    private timeshiftAction = 'takeSelected';
    private selectedTimezone: string;

    private dateFormatList = [
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("Y-m-d")), value: "Y-m-d"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("m-d-Y")), value: "m-d-Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("d-m-Y")), value: "d-m-Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("Y/m/d")), value: "Y/m/d"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("m/d/Y")), value: "m/d/Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("d/m/Y")), value: "d/m/Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("Y.m.d")), value: "Y.m.d"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("d.m.Y")), value: "d.m.Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("m.d.Y")), value: "m.d.Y"}
    ];
    private timeFormatList = [
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("H:i")), value: "H:i"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:ia")), value: "h:ia"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:iA")), value: "h:iA"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:i a")), value: "h:i a"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:i A")), value: "h:i A"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("H.i")), value: "H.i"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.ia")), value: "h.ia"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.iA")), value: "h.iA"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.i a")), value: "h.i a"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.i A")), value: "h.i A"}
    ];

    constructor( private backend: backend, private lang: language, private prefservice: userpreferences, private session: session, private router: Router, private toastservice: toast ) { }

    public ngOnInit() {
        if ( this.timeshift ) this.selectedTimezone = this.configuredTimezone = this.prefservice.unchangedPreferences.global.timezone;
        if ( this.isPrefMissing('timezone') || this.timeshift ) this.getTimezones();
        for ( let name of this.namesOfMissingPrefs ) this.preferences[name] = this.prefservice.defaults[name];
    }

    private save() {
        if ( this.timeshift ) {
            if ( this.timeshiftAction === 'takeSelected' && this.configuredTimezone !== this.selectedTimezone ) this.preferences = { timezone: this.selectedTimezone };
            if ( this.timeshiftAction === 'takeGuessed' ) this.preferences = { timezone: this.guessedTimezone };
        }
        if ( !_.isEmpty( this.preferences )) {
            this.prefservice.setPreferences( this.preferences ).subscribe( () => {
                this.toastservice.sendToast( this.lang.getLabel( 'LBL_DATA_SAVED' ), 'success' );
            } );
        }
        if ( this.navigateToUserPrefs ) this.router.navigate([ '/module/Users/'+this.session.authData.userId ]);
        this.self.destroy();
    }

    private canSave() {
        if ( this.namesOfMissingPrefs ) {
            for ( let pref of this.namesOfMissingPrefs ) if ( !this.preferences[pref] ) return false;
        }
        return true;
    }

    private isPrefMissing( prefName ) {
        return this.namesOfMissingPrefs.indexOf( prefName ) !== -1;
    }

    private getTimezones() {
        this.backend.getRequest( "/timezones" ).subscribe( response => {
            this.timezones = response;
            this.timezoneKeys = Object.keys( this.timezones );
        } );
    }

    public onModalEscX() {
        return false; // No ESC-Key allowed
    }

}
