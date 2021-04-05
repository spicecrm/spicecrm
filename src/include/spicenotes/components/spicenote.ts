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
 * @module ModuleSpiceNotes
 */
import {
    Component, OnInit, Input, NgZone, Output, EventEmitter
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {session} from "../../../services/session.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'spice-note',
    templateUrl: './src/include/spicenotes/templates/spicenote.html'
})
export class SpiceNote {

    /**
     * the note in the for loop
     */
    @Input() private note: any = {};

    private isEditing: boolean = false;

    @Output() private deleteNote: EventEmitter<any> = new EventEmitter<any>();

    /**
     * @ignore
     *
     * @param objectnote
     */
    constructor(public sanitized: DomSanitizer, private session: session, private backend: backend, private model: model) {

    }

    /**
     * get the timestamp and vonverts into a relative one
     */
    private getNoteTimeFromNow() {
        return moment(this.note.date).fromNow();
    }

    /**
     * delete the note
     */
    private delete() {
        this.deleteNote.emit();
    }

    /**
     * save the note
     */
    private saveNote() {
        this.isEditing = false;
        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/note/${this.note.id}`, {}, {text: this.note.text, global: !this.note.global});
    }

    /**
     * edit the note
     */
    private edit() {
        this.isEditing = true;
    }

    /**
     * sanitizes the value and passes it to the template
     */
    get htmlValue() {
        return this.sanitized.bypassSecurityTrustHtml(this.note.text);
    }

    private hideDeleteButton() {
        if (this.note.user_id != this.session.authData.userId && !this.session.authData.admin) {
            return true;
        }
        return false;
    }

    /**
     * tgggle a note privat or global
     */
    private togglePrivate() {
        this.note.global = !this.note.global;
    }

    /**
     * returns the proper icon for a private vs global note
     */
    private getPrivateIcon() {
        if (this.note.global) {
            return 'unlock';
        } else {
            return 'lock';
        }
    }
}
