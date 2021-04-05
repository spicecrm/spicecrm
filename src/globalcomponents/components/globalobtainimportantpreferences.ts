/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    selector: 'global-obtain-important-preferences',
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
        for ( let name of this.namesOfMissingPrefs ) this.preferences[name] = this.prefservice.defaults[name];
    }

    private save() {
        if ( this.timeshift ) {
            if ( this.timeshiftAction === 'takeSelected' && this.configuredTimezone !== this.selectedTimezone ) this.preferences.timezone = this.selectedTimezone;
            if ( this.timeshiftAction === 'takeGuessed' ) this.preferences.timezone = this.guessedTimezone;
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

    public onModalEscX() {
        return false; // No ESC-Key allowed
    }

}
