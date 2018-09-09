import { Component, EventEmitter, OnInit } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import {language} from '../../services/language.service';
import { toast } from '../../services/toast.service';

declare var window: any;

@Component({
    templateUrl: './src/systemcomponents/templates/systemtinymcemodal.html'
})
export class SystemTinyMCEModal implements OnInit {

    self: any = {};
    content: any = '';
    stylesheetId: string;
    updateContent: EventEmitter<any> = new EventEmitter<any>();
    title: string = '';

    constructor( private language: language ) { }

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