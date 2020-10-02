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
    templateUrl: './src/objectfields/templates/fieldlookuprecent.html'
})
export class fieldLookupRecent implements OnChanges {

    /**
     * the module for the recent items
     */
    @Input() private module: string = '';

    /**
     * emits the selectes item
     */
    @Output() private selectedObject: EventEmitter<any> = new EventEmitter<any>();
    private recentItems: any[] = [];

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
    private setParent(event, recentItem) {
        // stop the event
        event.preventDefault();

        this.selectedObject.emit({id: recentItem.data.id, text: recentItem.data.summary_text, data: recentItem.data});
    }

    /**
     * get the recent items filtered by the module
     */
    private getRecent() {
        this.recentItems = [];
        let recent = this.recent.getModuleRecent(this.module).subscribe(recentItems => {
            this.recentItems = recentItems;
        });
    }
}
