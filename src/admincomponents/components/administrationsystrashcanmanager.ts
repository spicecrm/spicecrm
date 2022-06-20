/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {userpreferences} from '../../services/userpreferences.service';
import {footer} from '../../services/footer.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'administration-systrashcan-manager',
    templateUrl: '../templates/administrationsystrashcanmanager.html'
})
export class AdministrationSysTrashcanManager implements OnInit {
    /**
     * holds the total count
     */
    public totalCount: number = 0;
    /**
     * holds the trashcan records
     */
    public records: any[] = [];
    /**
     * holds the load date
     */
    public loadDate: string;
    /**
     * loading boolean
     */
    public loading: boolean = false;
    /**
     * search term
     */
    public _searchTerm: string;
    /**
     * search term timeout
     */
    public searchTimeout: number;
    /**
     * search module for filter
     */
    public _searchModule: string;
    /**
     * search user for filter
     */
    public user: { id: string, name: string };
    /**
     * list of backend modules
     */
    public modules: string[];

    constructor(public metadata: metadata, public modal: modal, public backend: backend, public language: language, public userpreferences: userpreferences, public footer: footer) {
    }

    /**
     * Set the search term and reload
     * @param value
     */
    set searchTerm(value: string) {
        this._searchTerm = value;
        window.clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => this.reload(), 600);
    }

    /**
     * @return string search term
     */
    get searchTerm(): string {
        return this._searchTerm;
    }

    /**
     * Set the filter module and reload
     * @param value
     */
    set searchModule(value: string) {
        this._searchModule = value;
        this.reload();
    }

    /**
     * @return string filter module
     */
    get searchModule(): string {
        return this._searchModule;
    }

    /**
     * sets the filter for a specific user
     * @param data
     */
    set filterUser(data: string) {
        const valueArray = data?.split('::');
        this.user = !valueArray ? undefined : {id: valueArray[0], name: valueArray[1]};
        this.reload();
    }

    /**
     * @return string the data for the set user filter
     */
    get filterUser(): string {
        return !this.user ? undefined : this.user.id + '::' + this.user.name;
    }

    /**
     * initial load
     */
    public ngOnInit() {
        this.getEntries();
        this.modules = this.metadata.getModules().sort((a,b) => this.language.getModuleName(a).localeCompare(this.language.getModuleName(b)));
    }

    public getEntries() {

        this.loading = true;

        const params = {
            limit: 50,
            offset: this.records.length,
            module: this.searchModule,
            searchTerm: this.searchTerm,
            user: this.user?.id
        };

        this.backend.getRequest('admin/systrashcan', params).subscribe(data => {

            if (!data) return;

            data.records.forEach(r =>
                r.date_deleted = this.userpreferences.formatDateTime(moment(r.date_deleted))
            );

            this.totalCount = data.count;
            this.records = this.records.concat(data.records);
            this.loadDate = this.userpreferences.formatDateTime(moment());
            this.loading = false;
        });
    }

    /**
     * reload the list
     */
    public reload() {
        this.records = [];
        this.getEntries();
    }

    /**
     * recover a record
     * @param record
     */
    public recoverRecord(record) {

        const loading = this.modal.await(this.language.getLabel('LBL_LOADING'));

        this.backend.getRequest('admin/systrashcan/related/' + record.transactionid + '/' + record.recordid).subscribe(related => {
            loading.next(true);
            loading.complete();

            this.modal.openModal('AdministrationSysTrashcanRecover').subscribe(componentRef => {
                    componentRef.instance.record = record;
                    componentRef.instance.relatedRecords = related;
                    componentRef.instance.hasRelated = related.length > 0;
                    // subscribe to recovered event and if it is treu remove from the list
                    componentRef.instance.recovered.subscribe(recovered => {
                        if (!recovered) return;
                        this.records = this.records.filter(r => r.id != record.id);
                    });
                }
            );
        });
    }

    /**
     * load more records on scroll
     */
    public loadMore() {

        if (this.loading || this.records.length >= this.totalCount) return;

        this.getEntries();
    }

    /**
     * clear search term
     */
    public clearSearchTerm() {
        this.searchTerm = undefined;
        this.reload();
    }
}
