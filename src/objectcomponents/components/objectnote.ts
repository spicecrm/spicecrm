/**
 * @module ObjectComponents
 */
import {
    Component, OnInit, Input, NgZone
} from '@angular/core';
import {objectnote} from '../services/objectnote.service';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'object-note',
    templateUrl: './src/objectcomponents/templates/objectnote.html'
})
export class ObjectNote {

    /**
     * the note in the for loop
     */
    @Input() private note: any = {};

    /**
     * @ignore
     *
     * @param objectnote
     */
    constructor(private objectnote: objectnote, public sanitized: DomSanitizer) {

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
    private deleteNote() {
        this.objectnote.deleteNote(this.note.id);
    }

    /**
     * sanitizes the value and passes it to the template
     */
    get htmlValue()    {
        return this.sanitized.bypassSecurityTrustHtml(this.note.text);
    }
}
