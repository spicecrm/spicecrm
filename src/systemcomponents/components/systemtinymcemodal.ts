/**
 * @module SystemComponents
 */
import { Component, EventEmitter, OnInit } from '@angular/core';
import {language} from '../../services/language.service';

/**
 * @ignore
 */
declare var window: any;

@Component({
    templateUrl: '../templates/systemtinymcemodal.html'
})
export class SystemTinyMCEModal implements OnInit {

    self: any = {};
    content: any = '';
    stylesheetId: string;
    updateContent: EventEmitter<any> = new EventEmitter<any>();
    title: string = '';

    constructor( public language: language ) { }

    ngOnInit() {
        if ( this.title.length === 0 ) this.title = this.language.getLabel('LBL_EDITOR');
    }

    closeModal(){
        this.self.destroy();
    }

    contentChange(update){
        this.content = update;
        this.updateContent.emit(update);
    }

}
