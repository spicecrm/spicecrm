/**
 * @module ObjectComponents
 */
import {
    Component, OnInit, Input
} from '@angular/core';
import {objectnote} from '../services/objectnote.service';

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
    constructor(private objectnote: objectnote) {

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
}
