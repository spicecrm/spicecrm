/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import { backend } from '../../services/backend.service';
import { metadata } from '../../services/metadata.service';
import { language } from '../../services/language.service';
import { userpreferences } from '../../services/userpreferences.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';
import { BehaviorSubject } from 'rxjs';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'crm-log-viewer-list',
    templateUrl: '../templates/crmlogviewerlist.html'
})
export class CRMLogViewerList implements OnInit {

    @Input() public filter = { loglevels: '', pid: '', user_id: '', text: '', transaction_id: '', end: undefined };
    @Input() public period = { type: '', begin: { year: '', month: '', day: '', hour: '' }, end: { year: '', month: '', day: '', hour: '' }, duration: '' };
    @Input('load') public load$: EventEmitter<null>;
    @Input() public valuesNotClickable = false;
    @Output() public countEntries$ = new BehaviorSubject<number>(0);
    @Input() public limit: number;

    @Output('valueClicked') public valueClicked$ = new EventEmitter();

    /**
     * The log data from the backend
     * @private
     */
    public entries: any[] = [];

    /**
     * toast id
     * @private
     */
    public toastId = '';

    /**
     * stati
     * @private
     */
    public isLoading = false;
    public isLoaded = false;
    public isInitialLoaded = false;

    constructor( public backend: backend, public metadata: metadata, public lang: language, public prefs: userpreferences, public modalservice: modal, public toast: toast ) { }

    public ngOnInit() {
        if ( this.load$ ) {
            this.load$.subscribe( () => {
                this.loadData();
            });
        } else this.loadData();
    }

    /**
     * Load the log entries from the backend
     * @private
     */
    public loadData() {

        if ( this.isLoading ) return;

        this.isLoaded = false;
        this.isLoading = true;

        /**
         * Build the query parameters for the request
         */
        let queryParams = {
            loglevels: this.filter.loglevels ? this.filter.loglevels : undefined,
            pid: this.filter.pid ? this.filter.pid : undefined,
            user_id: this.filter.user_id ? this.filter.user_id : undefined,
            text: this.filter.text ? this.filter.text : undefined,
            transaction_id: this.filter.transaction_id ? this.filter.transaction_id : undefined,
            end: this.filter.end ? this.filter.end.utc().format( 'YYYY-MM-DD HH:mm:ss' ) : undefined,
            limit: this.limit
        };

        this.toast.clearToast( this.toastId );
        this.backend.getRequest( 'admin/crmlog/entries', queryParams ).subscribe(
            response => {
                this.entries = response.entries;
                this.countEntries$.next( this.entries.length );
                this.isLoading = false;
                this.isInitialLoaded = true;
            },
            error => {
                this.toast.sendToast('Error loading log data!', 'error' );
                this.isLoading = false;
            }
        );

    }

    /**
     * Open the modal window to display a log entry with unusual long log text.
     * @param i index of entries
     * @private
     */
    public showEntryInModal(i) {
        this.modalservice.openModal('CRMLogViewerModal' ).subscribe( modal => {
            modal.instance.entry = this.entries[i];
            modal.instance.user_name = this.entries[i].user_name;
        });
    }

}
