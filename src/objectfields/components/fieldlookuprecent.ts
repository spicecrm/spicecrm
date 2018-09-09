import {Component, ElementRef, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {recent} from '../../services/recent.service';

@Component({
    selector: 'field-lookup-recent',
    templateUrl: './app/objectfields/templates/fieldlookuprecent.html'
})
export class fieldLookupRecent implements OnInit{

    @Input() module: string = '';
    @Input() idfield: string = '';
    @Input() namefield: string = '';
    @Output() selectedObject: EventEmitter<any> = new EventEmitter<any>();
    recentItems: Array<any> = [];

    constructor(public model: model, public popup: popup, public recent: recent, public language: language) {

    }

    ngOnInit(){
        this.getRecent();
    }

    setParent(id, text, data?) {
        // set the data to the model
        // this.model.data[this.idfield] = id;
        this.model.data[this.namefield] = text;
        this.model.setField(this.idfield, id);

        // fake data object... hope it will be the whole record in future!
        if( !data )
            data = {'id': id, 'summary_text': text};

        this.selectedObject.emit({'id': id, 'text': text, 'data': data});

        this.popup.close();
    }

    getRecent() {
        this.recentItems = [];
        // get recent .. if it is an observable .. wait ..
        let recent = this.recent.getModuleRecent(this.module);
        if (recent instanceof Array)
            this.recentItems = recent;
        else
            recent.subscribe(recentItems => {
                this.recentItems = recentItems;
            });
    }

}