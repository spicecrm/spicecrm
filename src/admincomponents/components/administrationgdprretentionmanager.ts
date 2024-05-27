/**
 * @module Admin Inspector Module
 */
import {Component, OnInit, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {modelutilities} from '../../services/modelutilities.service';
import {Router} from "@angular/router";

/**
 * a component toi manage the GDPR record aging and deleting component
 */
@Component({
    selector: '[administration-gdpr-retention-manager]',
    templateUrl: '../templates/administrationgdprretentionmanager.html'
})

export class AdministrationGDPRRetentionManager implements OnInit {

    /**
     * the policies
     *
     * @private
     */
    public policies: any[] = [];

    /**
     * the current selected policy index
     * @private
     */
    public selectedPolicyIndex: number;

    /**
     * indicates when we are loading
     * @private
     */
    public isloading: boolean = false;

    /**
     * the results
     * @private
     */
    public results: any;

    /**
     * indicates if we are initialized
     *
     * @private
     */
    public initialized: boolean = false;

    /**
     * controls the buttons
     */
    public hasChanges: boolean = false;

    /**
     * set true if we have a new GDPR policy
     */
    public isNew: boolean = false;

    /**
     * cached selected policy
     */
    public cachedPolicy: any = {};

    constructor(
        public toast: toast,
        public modal: modal,
        public modelutilities: modelutilities,
        public backend: backend,
        public router: Router,
        public injector: Injector
    ) {
        this.initializeResults();
    }

    public ngOnInit() {
        this.loadPolicies();
    }

    /**
     * select the policy by index - needed since we do not have an ID before the recod is saved
     * @param index
     * @param policy
     * @private
     */
    public selectPolicyByIndex(index: number, policy: any) {
        if(this.hasChanges == true) {
            return this.toast.sendToast('MSG_HAS_UNSAVED', 'error');
        }

        if (!this.isloading && this.selectedPolicyIndex != index) {
            this.selectedPolicyIndex = index;
            this.cachedPolicy = {...policy};
            this.initializeResults();
        }
    }

    /**
     * returns the slected policy ba the index
     */
    get selectedPolicy() {
        return this.selectedPolicyIndex >= 0 ? this.policies[this.selectedPolicyIndex] : undefined;
    }

    /**
     * iniitalize the results object
     *
     * @private
     */
    public initializeResults() {
        this.results = {
            list: [],
            module: '',
            total: 0
        };
    }

    /**
     * loads the policies
     *
     * @private
     */
    public loadPolicies() {
        this.backend.getRequest('admin/gdprmanager/retentionpolicies').subscribe(
            policies => {
                this.policies = policies;
                this.initialized = true;
            }
        );
    }

    /**
     * toggles he active state
     *
     * @param policy
     * @private
     */
    public toggleStatus(policy) {
        if (policy.id) {
            policy.active = !policy.active;
            this.backend.postRequest(`admin/gdprmanager/retentionpolicies/${policy.id}/activate/${policy.active ? 1 : 0}`);
        }
    }

    /**
     * saves the selected policy
     *
     * @private
     */
    public save() {
        // if we have no id generate one
        let newPolicy = this.modelutilities.generateGuid();
        // post the record
        let loading = this.modal.await('LBL_SAVING');
        this.backend.postRequest(`admin/gdprmanager/retentionpolicies/${this.selectedPolicy.id ? this.selectedPolicy.id : newPolicy}`, {}, this.selectedPolicy).subscribe({
            next: () => {
                if (!this.selectedPolicy.id) this.selectedPolicy.id = newPolicy;
                this.cachedPolicy = {...this.selectedPolicy};
                this.hasChanges = false;
                this.isNew = false;
                loading.emit(true);
            },
            error: () => {
                loading.emit(true);
            }
        })
    }

    /**
     * revert all changes
     */
    public cancel() {
        this.hasChanges = false;
        this.policies[this.selectedPolicyIndex] = this.cachedPolicy;
    }

    /**
     * gets the records to be changed for a policy
     *
     * @private
     */
    public getResults() {
        this.isloading = true;
        this.results.list = [];
        this.backend.getRequest(`admin/gdprmanager/retentionpolicies/${this.selectedPolicy.id}/results`).subscribe({
            next: (res) => {
                this.results = res;
                this.isloading = false;
            },
            error: () => {
                this.isloading = false;
            }
        });
    }

    /**
     * loads more results if that is applicable
     *
     * @private
     */
    public loadmore() {
        if (!this.isloading && this.results.total > this.results.list.length) {
            this.isloading = true;
            this.backend.getRequest(`admin/gdprmanager/retentionpolicies/${this.selectedPolicy.id}/results`, {start: this.results.list.length}).subscribe(
                res => {
                    this.results.list = this.results.list.concat(res.list);
                    this.isloading = false;
                },
                () => {
                    this.isloading = false;
                }
            );
        }
    }

    /**
     * open the records
     *
     * @param id
     * @param e
     * @private
     */
    public openRecord(id, e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        this.router.navigate([`module/${this.results.module}/${id}`]);
    }

    /**
     * deletes a record by index
     *
     * @param index
     * @private
     */
    public deleteByIndex(index) {
        this.modal.confirm('LBL_DELETE_RECORD', 'LBL_DELETE_RECORD').subscribe(
            res => {
                if (res) {
                    if (this.selectedPolicy.id) {
                        let loading = this.modal.await('LBL_DELETING');
                        this.backend.deleteRequest(`admin/gdprmanager/retentionpolicies/${this.selectedPolicy.id}`).subscribe({
                            next: () => {
                                this.deletePolicy(index);
                                this.hasChanges = false;
                                loading.emit(true);
                            },
                            error: () => {
                                loading.emit(true);
                            }
                        })
                    } else {
                        this.deletePolicy(index);
                        this.hasChanges = false;
                    }

                }
            });
    }

    public deletePolicy(index) {
        if (this.selectedPolicyIndex == index) this.selectedPolicyIndex = undefined;
        this.policies.splice(index, 1);
    }

    /**
     * adds a new policy record
     *
     * @private
     */
    public addPolicy() {
        this.modal.input('LBL_POLICY_NAME', 'LBL_POLICY_NAME').subscribe(
            val => {
                if (val) {
                    let newPolicy = {
                        id: '',
                        name: val,
                        deleted: false,
                        retention_type: 'I',
                        active: false,
                        description: ''
                    };
                    this.policies.push(newPolicy);
                    this.cachedPolicy = newPolicy;
                    this.selectedPolicyIndex = this.policies.length - 1;
                    this.hasChanges = true;
                    this.isNew = true;
                }
            }
        );
    }

    /**
     * check if we have changes
     */
    public registerPolicyChanges(item: any) {
        if(this.cachedPolicy.id == item.id && !this.isNew) {
            this.hasChanges = JSON.stringify(item) != JSON.stringify(this.cachedPolicy);
        }
    }

}

