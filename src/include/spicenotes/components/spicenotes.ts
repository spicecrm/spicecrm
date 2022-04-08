/**
 * @module ModuleSpiceNotes
 */
import {
    Component, OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';

declare var moment: any;

/**
 * handles the spicenotes on the object allowing users to add quick notes (public or global visible)
 */
@Component({
    templateUrl: '../templates/spicenotes.html'
})
export class SpiceNotes implements OnInit {

    /**
     * vraible for th ebingind to the new note when the user enters on e
     */
    public newNote: string = '';

    /**
     * keep track if the textarea is active (focused)
     */
    public _active = false;

    /**
     * indicator that the new note is considered public and not global so only visible to the user who created it or admins
     */
    public isPrivate: boolean = false;

    /**
     * the list of notes
     */
    public notes: any = [];

    constructor(public model: model, public language: language, public session: session, public backend: backend, public broadcast: broadcast) {

    }

    public ngOnInit() {
        this.getNotes();
    }

    public getNotes() {
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/note`).subscribe(notes => {
            for(let thisNote of notes) {
                // thisNote.date = new Date(Date.parse(thisNote.date));
                thisNote.date =   moment.utc(thisNote.date);
                thisNote.global = thisNote.global === '1' || thisNote.global === true ? true : false;
                this.notes.push(thisNote);
            }

            // broadcast the count
            this.broadcastCount();
        });
    }

    public addNote() {
        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/note`, {}, {text: this.newNote, global: !this.isPrivate}).subscribe((notes : any ) => {
            for(let thisNote of notes) {
                // thisNote.date = new Date(Date.parse(thisNote.date));
                thisNote.date =   moment.utc(thisNote.date);
                thisNote.global = thisNote.global === '1' || thisNote.global === true ? true : false;
                this.notes.unshift(thisNote);
                this.newNote = '';

                // broadcast the count
                this.broadcastCount();
            }
        });
    }

    public deleteNote(id) {
        this.backend.deleteRequest(`module/${this.model.module}/${this.model.id}/note/${id}`).subscribe((notes: any ) => {
            this.notes.some((note, index) => {
                if(note.id === id) {
                    this.notes.splice(index, 1);

                    // broadcast the count
                    this.broadcastCount();

                    return true;
                }
            });
        });
    }

    public broadcastCount(){
        this.broadcast.broadcastMessage('spicenotes.loaded', {module: this.model.module, id: this.model.id, spicenotescount: this.notes.length});

    }

    /**
     * resets the note when the user cancels
     */
    public clearNote() {
        this.newNote = '';
        this.isPrivate = true;
    }


    /**
     * tgggle a note privat or global
     */
    public togglePrivate() {
        this.isPrivate = !this.isPrivate;
    }

    /**
     * returns the proper icon for a public vs global note
     */
    public getPrivateIcon() {
        if (this.isPrivate) {
            return 'lock';
        } else {
            return 'unlock';
        }
    }

    /**
     * returns the image of the current user if the user has mainatned an image
     */
    get userimage() {
        return this.session.authData.userimage;
    }

    /**
     * determine if the publisher is active or not
     */
    get isActive() {
        return this._active || this.newNote !== '';
    }

    /**
     * triggered when the textarea gets the focus
     */
    public onFocus() {
        this._active = true;
    }

    /**
     * triggered when the textarea has a blur event
     */
    public onBlur() {
        this._active = false;
    }

}
