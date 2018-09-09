import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {objectnote} from '../services/objectnote.service';

@Component({
    selector: 'object-notes',
    templateUrl: './app/objectcomponents/templates/objectnotes.html',
    providers: [objectnote]

})
export class ObjectNotes implements OnInit {

    newNote: string = '';
    isPrivate: boolean = false;

    constructor(private model: model, private objectnote: objectnote, private language: language) {

    }

    ngOnInit(){
        this.objectnote.module = this.model.module;
        this.objectnote.id = this.model.id;

        this.objectnote.getNotes();
    }

    clearNote(){
        this.newNote = '';
        this.isPrivate = false;
    }

    addNote(){
        this.objectnote.addNote(this.newNote, this.isPrivate);
        this.newNote = '';
    }


    togglePrivate(){
        this.isPrivate = !this.isPrivate;
    }

    getPrivateIcon(){
        if(this.isPrivate)
            return 'lock';
        else
            return 'unlock';
    }

}