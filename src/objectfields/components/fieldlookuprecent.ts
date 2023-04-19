/**
 * @module ObjectFields
 */
import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from '@angular/core';
import {model} from '../../services/model.service';
import {recent} from '../../services/recent.service';
import {language} from '../../services/language.service';
import {session} from '../../services/session.service';

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

    public loading: boolean = false;

    constructor(public model: model, public recent: recent, public language: language, public session: session, ) {

    }

    /**
     * redeterine the recent items on Changes
     */
    public ngOnChanges() {
        this.getRecent();
    }

    /**
     * special handling on the users field to have a shortcut to the current user
     * @param e
     */
    public setCurrentUser(e: MouseEvent){
        // stop the event
        e.preventDefault();
        this.selectedObject.emit({id: this.session.authData.userId, text: this.session.authData.user.full_name, data: this.session.authData.user});
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
        this.loading = true;
        this.recentItems = [];
        let recent = this.recent.getModuleRecent(this.module).subscribe(recentItems => {
            this.recentItems = recentItems;
            this.loading = false;
        });
    }
}
