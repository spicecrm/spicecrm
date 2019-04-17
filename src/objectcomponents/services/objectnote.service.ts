/**
 * @module ObjectComponents
 */
import {Injectable} from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { backend } from '../../services/backend.service';
import { modelutilities } from '../../services/modelutilities.service';

/**
* @ignore
*/
declare var moment: any;

@Injectable()
export class objectnote {

    notes: Array<any> = [];
    module: string = '';
    id: string = '';

    constructor(private backend: backend, private modelutilities: modelutilities) {
    }

    getNotes(){
        this.backend.getRequest('module/'+this.module+'/'+this.id+'/note').subscribe(notes => {
            for(let thisNote of notes){
                //thisNote.date = new Date(Date.parse(thisNote.date));
                thisNote.date =   moment.utc(thisNote.date);
                thisNote.global = thisNote.global === '1' || thisNote.global === true ? true : false;
                this.notes.push(thisNote);
            }
        })
    }

    addNote(note, isPrivate){
        this.backend.postRequest('module/'+this.module+'/'+this.id+'/note', {}, {text: note, global: !isPrivate}).subscribe((notes : any ) => {
            for(let thisNote of notes){
                //thisNote.date = new Date(Date.parse(thisNote.date));
                thisNote.date =   moment.utc(thisNote.date);
                thisNote.global = thisNote.global === '1' || thisNote.global === true ? true : false;
                this.notes.unshift(thisNote);
            }
        })
    }

    deleteNote(id){
        this.backend.deleteRequest('module/'+this.module+'/'+this.id+'/note/'+id).subscribe((notes : any ) => {
            this.notes.some((note, index) => {
                if(note.id === id){
                    this.notes.splice(index, 1);
                    return true;
                }
            })
        })
    }
}