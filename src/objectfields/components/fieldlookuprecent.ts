/**
 * @module ObjectFields
 */
import {Component, Input, Output, OnInit, EventEmitter, OnChanges, Renderer2, OnDestroy} from '@angular/core';
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
export class fieldLookupRecent implements OnInit, OnChanges , OnDestroy {

    /**
     * the module for the recent items
     */
    @Input() public module: string = '';

    /**
     * input element from template
     */
    @Input() public inputElement;

    private listener: any;

    /**
     * selected item for keyboard navigation
     */
    public selectedItem: {data:{id:string, summary_text:string}};

    /**
     * emits the selectes item
     */
    @Output() public selectedObject: EventEmitter<any> = new EventEmitter<any>();
    public recentItems: any[] = [];

    public loading: boolean = false;

    constructor(public model: model, public recent: recent, public language: language, public session: session, public renderer: Renderer2,) {


    }
// event listener for keyboard events
    public ngOnInit() {
        if (this.inputElement) {
            this.listener = this.renderer.listen(this.inputElement, 'keyup', (e: KeyboardEvent) => {
                const index = this.recentItems.findIndex(i => i == this.selectedItem);
                switch (e.key) {
                    case 'Enter':
                        if(this.recentItems.length == 1) this.selectedItem = this.recentItems[0];
                        this.selectedObject.emit({
                            id: this.selectedItem.data.id,
                            text: this.selectedItem.data.summary_text,
                            data: this.selectedItem.data
                        });
                        break;
                    case 'ArrowDown':
                        this.selectedItem = this.recentItems[index + 1 >= this.recentItems.length ? 0 : index + 1];
                        break;
                    case 'ArrowUp':
                        this.selectedItem = this.recentItems[index - 1 < 0 ? this.recentItems.length - 1 : index - 1];
                        break;
                        case 'Escape':
                        this.selectedItem = {data:{id:'', summary_text:''}};
                        break;
                }
            });
        }
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

    /**
     * unlisten
     */
    public ngOnDestroy() {
        if (this.listener) {
            this.listener()
        }
    }
}
