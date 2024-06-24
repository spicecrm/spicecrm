/**
 * @module ModuleCampaigns
 */
import {Component, ComponentRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {TargetI} from "../interfaces/campaigns.interfaces";
import {toast} from "../../../services/toast.service";
import {metadata} from "../../../services/metadata.service";
import {broadcast} from "../../../services/broadcast.service";
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";
import {lastValueFrom, Subscription} from "rxjs";
import {userpreferences} from "../../../services/userpreferences.service";

/**
 * allows management of targets in multiple targetlists on a campaigntask
 */
@Component({
    selector: 'campaigntask-target-manager',
    templateUrl: '../templates/campaigntasktargetsmanager.html',
    providers: [model]
})
export class CampaignTaskTargetsManager implements OnInit, OnDestroy {

    /**
     * modules: comma separated modules to be searched
     */
    public componentconfig: { modules: string };

    /**
     * modules: comma separated modules to be searched
     */
    public subscriptions = new Subscription();
    /**
     * modules: comma separated modules to be searched
     */
    public currentPage = 1;
    /**
     * holds the prospect lists
     */
    public prospectLists: any[] = [];
    /**
     * holds a list of the targets
     */
    public prospects: TargetI[] = [];
    /**
     * backend loading boolean
     */
    public loading: boolean = false;
    /**
     * holds the total count
     */
    public totalCount = 0;
    /**
     * the limit of the loaded targets
     */
    public limit = 50;
    /**
     * the offset of the loaded targets
     */
    public offset = 0;
    /**
     * holds the inclusion list id
     */
    public inclusionList: {id: string, name: string};
    /**
     * holds the inclusion list id
     */
    public exclusionList: {id: string, name: string};
    /**
     * holds the fieldset ids for the elements where the key is the module name and the value is the fieldset id
     */
    public detailsFieldSets: { [key: symbol]: string } = {};
    /**
     * holds the sort fields for the modules
     */
    public modulesSortFields: { [key: symbol]: string[] } = {};
    /**
     * holds the sort fields for the modules
     */
    public modulesFields: { [key: symbol]: {field: string, fieldconfig: string}[] } = {};
    /**
     * holds the available modules defined in the component config
     */
    public modules: string[] = [];
    /**
     * id of the clicked entry to highlight
     */
    public clickedEntryId: string;

    constructor(public backend: backend,
                public modal: modal,
                public toast: toast,
                public parent: model,
                public injector: Injector,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public userPreferences: userpreferences,
                public navigationtab: navigationtab) {

    }

    /**
     * local property for the search term getter/setter
     * @private
     */
    private _searchTerm: string = '';

    /**
     * return the search term
     */
    get searchTerm(): string {
        return this._searchTerm;
    }

    /**
     * set the search term and trigger the search
     * @param term
     */
    set searchTerm(term: string) {

        this._searchTerm = term;
        this.onPageChange(1);
    }

    /**
     * local property for the search term getter/setter
     * @private
     */
    private _currentListId: string = '';

    /**
     * return the current list id
     */
    get currentListId(): string {
        return this._currentListId;
    }

    /**
     * set the current list id and trigger the search
     * @param id
     */
    set currentListId(id: string) {

        this._currentListId = id;
        this.onPageChange(1)
    }

    /**
     * local property for the current filter status
     * @private
     */
    private _currentFilterStatus: 'checked' | 'unchecked' | 'excluded' | 'included' | '' = '';

    /**
     * return the current filter status
     */
    get currentFilterStatus(): 'checked' | 'unchecked' | 'excluded' | 'included' | '' {
        return this._currentFilterStatus;
    }

    /**
     * set the current filter status and reload the targets
     * @param status
     */
    set currentFilterStatus(status: 'checked' | 'unchecked' | 'excluded' | 'included' | '') {

        this._currentFilterStatus = status;
        this.onPageChange(1)
    }

    /**
     * local property for the current filter module
     * @private
     */
    private _currentModule: string = '';

    /**
     * return the current filter module
     */
    get currentModule(): string {
        return this._currentModule;
    }

    /**
     * set the current filter module and reload the targets
     * @param module
     */
    set currentModule(module: string) {

        this._currentModule = module;
        this.sortObject.sortfield = undefined;
        this.onPageChange(1)
    }

    /**
     * holds the sort object
     * @private
     */
    private sortObject: {sortfield: string, sortdirection: 'ASC' | 'DESC'} = {sortfield: undefined, sortdirection: 'ASC'};

    /**
     * getter for the sort field
     */
    get sortField(): string {
        return this.sortObject.sortfield;
    }

    /**
     * sets the sort field
     * @param field
     */
    set sortField(field: string) {
        this.sortObject.sortfield = field;
        this.onPageChange(1)
    }

    /**
     * getter for the sort field
     */
    get sortDirection(): 'ASC' | 'DESC' {
        return this.sortObject.sortdirection;
    }

    /**
     * sets the sort direction
     * @param direction
     */
    set sortDirection(direction: 'ASC' | 'DESC') {
        this.sortObject.sortdirection = direction;
        this.onPageChange(1)
    }

    public ngOnInit(): void {
        this.initialize(this.navigationtab.activeRoute.params);
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public reload() {
        this.getTargets();
    }

    /**
     * open inclusion modal
     */
    public async add() {

        const options = this.modules.map(m => ({
            value: m,
            display: this.language.getModuleName(m)
        }));

        if (!this.inclusionList) {
            this.inclusionList = await this.createInclusionList() as {id: string, name: string};
        }

        this.modal.prompt('input', '', 'LBL_SELECT_MODULE', 'shade', undefined, options, true)
            .subscribe({
                next: (module: string) => {
                    if (!module) return;
                    this.modal.openModal("ObjectModalModuleLookup").subscribe(
                        (selectModal: ComponentRef<ObjectModalModuleLookup>) => {
                            selectModal.instance.module = module;
                            selectModal.instance.multiselect = true;
                            selectModal.instance.selectedItems.subscribe({
                                next: selectedItems => {
                                    const body = selectedItems.map(e => e.id);
                                    this.backend.postRequest(`module/ProspectLists/${this.inclusionList.id}/related/${module.toLowerCase()}`, [], body)
                                        .subscribe({
                                            next: () => {
                                                this.updateStatus('included', selectedItems.map(t => t.id)).then(() => {
                                                    this.getTargets();
                                                });
                                            }
                                        });
                                }
                            });
                        }
                    )
                }
            });
    }

    /**
     * initializes when the activated Route returns the promise in the constructor
     *
     * @param params the Route Params returned
     */
    public initialize(params: Params) {
        // get the bean details
        this.parent.module = params.module;
        this.parent.id = params.id;
        this.parent.getData(true, '', true).subscribe(() => {
            // set the tab params
            this.navigationtab.setTabInfo({
                displayname: this.parent.getField('summary_text') + ' - ' + this.language.getLabel('LBL_MANAGE_TARGETS'),
                displaymodule: 'ProspectLists'
            });
        });

        this.componentconfig = this.metadata.getComponentConfig('CampaignTaskTargetsManager', this.parent.module);

        this.modules = this.componentconfig.modules.split(',');

        this.modules.forEach(m => {
            const config = this.metadata.getComponentConfig('CampaignTaskTargetsManagerDetails', m);
            this.detailsFieldSets[m] = config?.fieldset;

            if (!!config?.fieldset) {
                this.modulesFields[m] = this.metadata.getFieldSetItems(config.fieldset);
                this.modulesSortFields[m] = this.modulesFields[m].filter(e => e.fieldconfig?.sortable).map(e => e.field);
            }
        });

        this.getTargets();

        this.subscribeToModelChanges();
    }

    /**
     * subscribe to model changes to update the entries on save in other tab
     */
    private subscribeToModelChanges() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => {

                if (msg.messagetype != 'model.save' || !this.modules.some(m => msg.messagedata.module == m)) return;

                this.prospects.some(p => {
                    if (p.id != msg.messagedata.id) return false;
                    p.data = msg.messagedata.data;
                });
            })
        );
    }

    /**
     * get targets from backend
     */
    public getTargets() {

        this.loading = true;

        this.prospects = [];

        const params = {
            offset: this.offset ?? 0,
            limit: 50,
            searchTerm: this.searchTerm,
            status: this.currentFilterStatus,
            modules: !!this.currentModule ? this.currentModule : this.componentconfig.modules,
            sort: this.sortObject,
            prospectListIds: !this.currentListId ? undefined : [this.currentListId]
        };

        this.backend.getRequest(`module/${this.parent.module}/${this.parent.id}/targets`, params).subscribe({
            next: (res) => {

                this.inclusionList = res.prospectlists.find(l => l.list_type == 'include' && l.is_generated_by_system == 1);
                this.exclusionList = res.prospectlists.find(l => l.list_type == 'exclude' && l.is_generated_by_system == 1);
                this.prospectLists = res.prospectlists.filter(l => l.is_generated_by_system != 1);

                this.prospects = res.prospects;
                this.prospects.forEach(prospect => {
                    prospect.prospectListsDisplay = this.getProspectListsDisplay(prospect.prospectlists);
                    if (!!prospect.status_date_changed) {
                        prospect.status_date_changed = this.userPreferences.formatDateTime(prospect.status_date_changed);
                    }
                });

                this.totalCount = parseInt(res.count, 10);
                // if we have less than 50 records set the limit automatically
                if (this.totalCount <= this.limit) {
                    this.limit = this.totalCount;
                } else {
                    this.limit = 50;
                }

                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /**
     * navigates to the parent model record. Used in the breadcrumbs
     */
    public goModel() {
        this.parent.goDetail();
    }

    /**
     * navigates to the parent module. Used in the breadcrumbs
     */
    public goModule() {
        this.parent.goModule();
    }

    /**
     * set prospects status
     * @param status
     * @param prospect
     */
    public setStatus(status: 'checked' | 'excluded' | 'included', prospect?: TargetI) {

        prospect.status = status;

        this.updateStatus(status, [prospect.id]);
    }

    /**
     * exclude all loaded targets
     */
    public excludeAll() {
        const targets = [];

        this.prospects.forEach(p => {
            if (p.status == 'included' || p.status == 'excluded') return;
            targets.push(p.id);
            p.status = 'excluded';
        });

        this.updateStatus('excluded', targets);
    }

    /**
     * check all loaded targets
     */
    public checkAll() {

        const targets = [];

        this.prospects.forEach(p => {
            if (!!p.status) return;
            targets.push(p.id);
            p.status = 'checked';
        });

        this.updateStatus('checked', targets);
    }

    /**
     * set page and offset and reload targets
     * @param page
     */
    public onPageChange(page: number) {

        this.currentPage = page;
        this.offset = (page - 1) * this.limit;

        this.getTargets();
    }

    /**
     * remove included target
     * @param prospect
     */
    public removeIncluded(prospect: TargetI) {

        const relatedids = [{beanId: prospect.id}];

        this.prospects = this.prospects.filter(p => p.id != prospect.id);
        this.backend.deleteRequest(`module/ProspectLists/${prospect.prospectlists[0]}/related/${prospect.module.toLowerCase()}`, {relatedids})
            .subscribe({
                error: () => this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error')
            });
    }

    /**
     * create inclusion list
     * @private
     */
    private createInclusionList(): Promise<{name: string, id: string}> {

        const loadingModal = this.modal.await('LBL_LOADING');

        return lastValueFrom(this.backend.postRequest(`module/${this.parent.module}/${this.parent.id}/targets/list/inclusion`))
            .then((res: { id: string, name: string }) => {
                loadingModal.next(true);
                loadingModal.complete();
                return res;
            })
            .catch(() => {
                loadingModal.next(true);
                loadingModal.complete();
                return undefined;
            });
    }

    /**
     * update targets status on the backend
     * @param status
     * @param targets
     * @private
     */
    private updateStatus(status: 'checked' | 'excluded' | 'included', targets: string[]) {

        return new Promise<void>((resolve, reject) => {
            this.backend.postRequest(`module/${this.parent.module}/${this.parent.id}/targets/status/${status}`, null, {targets})
                .subscribe({
                    next: () => {
                        resolve();
                    },
                    error: () => {
                        this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                        reject();
                    }
                });
        });
    }

    /**
     * return comma separated prospect lists of an item
     * @param prospectListIds
     */
    private getProspectListsDisplay(prospectListIds: string[]): string {
        return prospectListIds.map(id => this.prospectLists.find(p => p.id == id)?.name).filter(p => !!p).join(', ');
    }

    /**
     * set the clicked entry
     * @param id
     */
    public setClickedEntry(id: string) {
        this.clickedEntryId = id == this.clickedEntryId ? undefined : id;
    }
}
