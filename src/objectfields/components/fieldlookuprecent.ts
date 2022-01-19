/**
 * @module ObjectFields
 */
import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {recent} from '../../services/recent.service';

/**
 * renders the recent items container in module lookup fields like parent, lookup and others
 */
@Component({
    selector: 'field-lookup-recent',
    templateUrl: '../templates/fieldlookuprecent.html'
})
export class fieldLookupRecent implements OnChanges {

    /**
     * the module for the recent items
     */
    @Input() public module: string = '';

    /**
     * emits the selectes item
     */
    @Output() public selectedObject: EventEmitter<any> = new EventEmitter<any>();
    public recentItems: any[] = [];

    constructor(public model: model, public recent: recent, public language: language) {

    }

    /**
     * redeterine the recent items on Changes
     */
    public ngOnChanges() {
        this.getRecent();
    }

    /**
     * handels when the userr selects an item
     *
     * @param event
     * @param recentItem
     */
    public setParent(event, recentItem) {
        // stop the event
        event.preventDefault();

        this.selectedObject.emit({id: recentItem.data.id, text: recentItem.data.summary_text, data: recentItem.data});
    }

    /**
     * get the recent items filtered by the module
     */
    public getRecent() {
        this.recentItems = [];
        let recent = this.recent.getModuleRecent(this.module).subscribe(recentItems => {
            this.recentItems = recentItems;
        });
    }
}
