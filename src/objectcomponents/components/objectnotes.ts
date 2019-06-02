/**
 * @module ObjectComponents
 */
import {
    Component, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import {objectnote} from '../services/objectnote.service';


/**
 * handles the spicenotes on the object allowing users to add quick notes (private or global visible)
 */
@Component({
    selector: 'object-notes',
    templateUrl: './src/objectcomponents/templates/objectnotes.html',
    providers: [objectnote]

})
export class ObjectNotes implements OnInit {

    /**
     * vraible for th ebingind to the new note when the user enters on e
     */
    private newNote: string = '';

    /**
     * indicator that the new note is considered private and not global so only visible to the user who created it or admins
     */
    private isPrivate: boolean = false;

    constructor(private model: model, private objectnote: objectnote, private language: language, private session: session) {

    }

    public ngOnInit() {
        this.objectnote.module = this.model.module;
        this.objectnote.id = this.model.id;

        this.objectnote.getNotes();
    }

    /**
     * resets the note when the user cancels
     */
    private clearNote() {
        this.newNote = '';
        this.isPrivate = false;
    }

    /**
     * adds thje note on the backend
     */
    private addNote() {
        this.objectnote.addNote(this.newNote, this.isPrivate);
        this.newNote = '';
    }


    /**
     * tgggle a note privat or global
     */
    private togglePrivate() {
        this.isPrivate = !this.isPrivate;
    }

    /**
     * returns the proper icon for a private vs global note
     */
    private getPrivateIcon() {
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

}
