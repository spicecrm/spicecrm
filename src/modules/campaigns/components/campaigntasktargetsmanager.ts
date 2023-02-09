/**
 * @module ModuleCampaigns
 */
import {Component, ComponentRef, Injector, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {TargetI} from "../interfaces/campaigns.interfaces";
import {toast} from "../../../services/toast.service";
import {metadata} from "../../../services/metadata.service";
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";
import {lastValueFrom} from "rxjs";
import {userpreferences} from "../../../services/userpreferences.service";

/**
 * allows management of targets in multiple targetlists on a campaigntask
 */
@Component({
    selector: 'campaigntask-target-manager',
    templateUrl: '../templates/campaigntasktargetsmanager.html',
    providers: [model]
})
export class CampaignTaskTargetsManager implements OnInit {

    /**
     * modules: comma separated modules to be searched
     */
    public componentconfig: { modules: string };
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
    public inclusionListId: string;
    /**
     * holds the fieldset ids for the elements where the key is the module name and the value is the fieldset id
     */
    public detailsFieldSets: { [key: symbol]: string } = {};

    constructor(public backend: backend,
                public modal: modal,
                public toast: toast,
                public parent: model,
                public injector: Injector,
                public language: language,
                public metadata: metadata,
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
        this.getTargets();
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
        this.getTargets();
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
        this.getTargets();
    }

    public ngOnInit(): void {
        this.initialize(this.navigationtab.activeRoute.params);
    }

    public reload() {
        this.getTargets();
    }

    /**
     * open inclusion modal
     */
    public async add() {

        const options = this.componentconfig.modules.split(',').map(m => ({
            value: m,
            display: this.language.getModuleName(m)
        }));

        if (!this.inclusionListId) {
            this.inclusionListId = await this.createInclusionList() as any;
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
                                    this.backend.postRequest(`module/ProspectLists/${this.inclusionListId}/related/${module.toLowerCase()}`, [], body)
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

        this.componentconfig.modules.split(',').forEach(m => {
            const config = this.metadata.getComponentConfig('CampaignTaskTargetsManagerDetails', m);
            this.detailsFieldSets[m] = config?.fieldset;
        });

        this.getTargets();
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
            modules: this.componentconfig.modules,
            prospectListIds: !this.currentListId ? undefined : [this.currentListId]
        };

        this.backend.getRequest(`module/${this.parent.module}/${this.parent.id}/targets`, params).subscribe({
            next: (res) => {
                this.prospectLists = res.prospectlists;
                this.prospects = res.prospects;
                this.prospects.forEach(prospect => {
                    prospect.prospectListsDisplay = this.getProspectListsDisplay(prospect.prospectlists);
                    prospect.status_date_changed = this.userPreferences.formatDateTime(prospect.status_date_changed);
                });

                this.totalCount = parseInt(res.count, 10);
                // if we have less than 50 records set the limit automatically
                if (this.totalCount <= this.limit || (this.currentPage * this.limit) > this.totalCount) {
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
        const body = {
            relatedids: [prospect.id]
        };

        this.prospects = this.prospects.filter(p => p.id != prospect.id);

        this.backend.deleteRequest(`module/ProspectLists/${prospect.prospectlists[0]}/related/${prospect.module.toLowerCase()}`, body)
            .subscribe({
                error: () => this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error')
            });
    }

    /**
     * create inclusion list
     * @private
     */
    private createInclusionList(): Promise<string> {

        const loadingModal = this.modal.await('LBL_LOADING');

        return lastValueFrom(this.backend.postRequest(`module/${this.parent.module}/${this.parent.id}/targets/list/inclusion`))
            .then((res: { id }) => {
                loadingModal.next(true);
                loadingModal.complete();
                return res.id;
            })
            .catch(() => {
                loadingModal.next(true);
                loadingModal.complete();
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
        return prospectListIds.map(id => this.prospectLists.find(p => p.id == id).name).join(', ');
    }
}
