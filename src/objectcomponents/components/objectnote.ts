/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy, Input
} from '@angular/core';
import {objectnote} from '../services/objectnote.service';

declare var moment: any;

@Component({
    selector: 'object-note',
    templateUrl: './app/objectcomponents/templates/objectnote.html'
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