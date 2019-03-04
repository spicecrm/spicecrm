/**
 * @module ObjectFields
 */
import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {recent} from '../../services/recent.service';

@Component({
    selector: 'field-lookup-recent',
    templateUrl: './src/objectfields/templates/fieldlookuprecent.html'
})
export class fieldLookupRecent implements OnInit {

    @Input() private module: string = '';
    @Input() private idfield: string = '';
    @Input() private namefield: string = '';
    @Output() private selectedObject: EventEmitter<any> = new EventEmitter<any>();
    private recentItems: Array<any> = [];

    constructor(public model: model, public popup: popup, public recent: recent, public language: language) {

    }

    public ngOnInit() {
        this.getRecent();
    }

    private setParent(event, id, text, data?) {
        // stop the event
        event.preventDefault();

        // fake data object... hope it will be the whole record in future!
        if (!data) {
            data = {'id': id, 'summary_text': text};
        }

        this.selectedObject.emit({'id': id, 'text': text, 'data': data});

        this.popup.close();
    }

    private getRecent() {
        this.recentItems = [];
        let recent = this.recent.getModuleRecent(this.module).subscribe(recentItems => {
            this.recentItems = recentItems;
        });
    }
}
