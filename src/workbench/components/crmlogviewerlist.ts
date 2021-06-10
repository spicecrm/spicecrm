/**
 * @module WorkbenchModule
 */
import {
    Component,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    OnInit,
    AfterViewChecked,
    ApplicationRef, ChangeDetectorRef
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
    templateUrl: './src/workbench/templates/crmlogviewerlist.html',
    styles: [
        'td.expanded { white-space: normal; word-break: break-word; }',
        'td.expanded div { overflow-wrap: break-word; line-height: unset; }',
        'td.collapsed > div { position: absolute; top:0; bottom:0; right:0; left:0; padding: calc(0.25rem + 4px) calc(0.5rem + 0px); line-height: 1.17; }',
        ':host { display: block; height: 100%; }'
    ]
})
export class CRMLogViewerList implements OnInit, AfterViewChecked {

    @Input() private filter = { log_level: '', pid: '', user_id: '', text: '', transaction_id: '', end: undefined };
    @Input() private period = { type: '', begin: { year: '', month: '', day: '', hour: '' }, end: { year: '', month: '', day: '', hour: '' }, duration: '' };
    @Input('load') private load$: EventEmitter<null>;
    @Input() private valuesNotClickable = false;
    @Output() private countEntries$ = new BehaviorSubject<number>(0);
    @Input() private limit: number;

    @Output('valueClicked') private valueClicked$ = new EventEmitter();

    // Configuration:
    private routeBase = 'admin/crmlog';

    // The log data from the backend:
    private entries: any[] = [];
    // private entriesToShow: any[] = []; // Same as "entries" if no text filter is applied.

    // Various:
    private localFiltertextPositive = '';
    private localFiltertextNegative: any[] = [];
    private toastId = '';

    // Stati:
    private isLoading = false;
    private isLoaded = false;
    // private isBuildingLocalTextfilter = false;
    private isInitialLoaded = false;

    @ViewChild('tbody', {static: true}) private tbody: ElementRef; // Reference to the tbody dom element of the data table.

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences, private modalservice: modal, private toast: toast, private changeDetector: ChangeDetectorRef ) { }

    public ngOnInit() {
        if ( this.load$ ) {
            this.load$.subscribe( () => {
                this.loadData();
            });
        } else this.loadData();
    }

    // Load the log entries from the backend.
    private loadData() {

        if ( !this.canLoad()) return;

        let route = this.routeBase+'/entries';

        this.isLoaded = false;
        // this.entriesToShow = [];
        this.localFiltertextPositive = '';
        this.localFiltertextNegative = [];

        this.isLoading = true;

        // Build the query parameters for the request:
        let queryParams = {
            log_level: this.filter.log_level ? this.filter.log_level : undefined,
            pid: this.filter.pid ? this.filter.pid : undefined,
            user_id: this.filter.user_id ? this.filter.user_id : undefined,
            text: this.filter.text ? this.filter.text : undefined,
            transaction_id: this.filter.transaction_id ? this.filter.transaction_id : undefined,
            end: this.filter.end ? this.filter.end.utc().format( 'YYYY-MM-DD HH:mm:ss' ) : undefined,
            limit: this.limit
        };

        this.toast.clearToast( this.toastId );
        this.backend.getRequest( route, queryParams ).subscribe(
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

    // Are all the inputs correct and ready for the backend request?
    private canLoad() {
        if ( this.isLoading ) return false;
        return true;
    }

    // After the angular-rendering we check for every log entry / table row, if the log text is truncated by the browser (because it wouldn´t fit into column) or not.
    // The trick to detect truncation: When scrollWidth > clientWidth.
    public ngAfterViewChecked() {
        let htmlTableRows;
        let numberOfTextColumn = 5;
        let numberOfExpandButtonColumn = 6;
        if ( this.tbody && this.tbody.nativeElement ) {
            htmlTableRows = this.tbody.nativeElement.childNodes;
            if ( htmlTableRows ) {
                // We iterate the tbody, but we skip non tr elements and any dom elements not containing log data (for example: angular comments).
                htmlTableRows.forEach( ( row ) => {
                    if( row.tagName !== 'TR' || row.childNodes.length < 2 ) return;
                    let div = row.childNodes[numberOfTextColumn].childNodes[0];
                    row.childNodes[numberOfExpandButtonColumn].childNodes[0].style.visibility = ( div.scrollWidth === div.clientWidth ? 'hidden':'auto' ); // Show the expand button only when the div is not (yet) truncated.
                });
            }
        }
    }

    // Open the modal window to display a log entry with unusual long log text.
    private showEntryInModal(i) {
        this.modalservice.openModal('CRMLogViewerModal' ).subscribe( modal => {
            modal.instance.entry = this.entries[i];
            modal.instance.user_name = this.entries[i].user_name;
            modal.instance.routeBase = this.routeBase;
        });
    }

}
