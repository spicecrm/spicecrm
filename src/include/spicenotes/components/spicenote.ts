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
    templateUrl: '../templates/spicenote.html'
})
export class SpiceNote {

    /**
     * the note in the for loop
     */
    @Input() public note: any = {};

    public isEditing: boolean = false;

    @Output() public deleteNote: EventEmitter<any> = new EventEmitter<any>();

    /**
     * @ignore
     *
     * @param objectnote
     */
    constructor(public sanitized: DomSanitizer, public session: session, public backend: backend, public model: model) {

    }

    /**
     * get the timestamp and vonverts into a relative one
     */
    public getNoteTimeFromNow() {
        return moment(this.note.date).fromNow();
    }

    /**
     * delete the note
     */
    public delete() {
        this.deleteNote.emit();
    }

    /**
     * save the note
     */
    public saveNote() {
        this.isEditing = false;
        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/note/${this.note.id}`, {}, {text: this.note.text, global: !this.note.global});
    }

    /**
     * edit the note
     */
    public edit() {
        this.isEditing = true;
    }

    /**
     * sanitizes the value and passes it to the template
     */
    get htmlValue() {
        return this.sanitized.bypassSecurityTrustHtml(this.note.text);
    }

    public hideDeleteButton() {
        if (this.note.user_id != this.session.authData.userId && !this.session.authData.admin) {
            return true;
        }
        return false;
    }

    /**
     * tgggle a note privat or global
     */
    public togglePrivate() {
        this.note.global = !this.note.global;
    }

    /**
     * returns the proper icon for a public vs global note
     */
    public getPrivateIcon() {
        if (this.note.global) {
            return 'unlock';
        } else {
            return 'lock';
        }
    }
}
