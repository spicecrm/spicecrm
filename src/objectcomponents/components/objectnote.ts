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

@Component({
    selector: 'object-note',
    templateUrl: './src/objectcomponents/templates/objectnote.html'
})
export class ObjectNote implements OnInit {

    @Input() note: any = {};

    constructor(private objectnote: objectnote ) {

    }

    ngOnInit(){

    }

    getNoteTimeFromNow(){
        return moment(this.note.date).fromNow();
    }

    deleteNote(){
        this.objectnote.deleteNote(this.note.id);
    }
}