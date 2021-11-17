/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/admincomponents/templates/administrationgdprretentionmanager.html'
})

export class AdministrationGDPRRetentionManager implements OnInit {

    /**
     * the policies
     *
     * @private
     */
    private policies: any[] = [];

    /**
     * the current selected policy index
     * @private
     */
    private selectedPolicyIndex: number;

    /**
     * indicates when we are loading
     * @private
     */
    private isloading: boolean = false;

    /**
     * the results
     * @private
     */
    private results: any;

    /**
     * indicates if we are initialized
     *
     * @private
     */
    private initialized: boolean = false;

    constructor(
        private toast: toast,
        private modal: modal,
        private modelutilities: modelutilities,
        private backend: backend,
        private router: Router,
        private injector: Injector
    ) {
        this.initializeResults();
    }

    public ngOnInit() {
        this.loadPolicies();
    }

    /**
     * select the policy by index - needed since we do not have an ID before the recod is saved
     * @param index
     * @private
     */
    private selectPolicyByIndex(index) {
        if (!this.isloading && this.selectedPolicyIndex != index) {
            this.selectedPolicyIndex = index;
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
    private initializeResults() {
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
    private loadPolicies() {
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
    private toggleStatus(policy) {
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
    private save() {
        // if we have no id generate one
        let newPolicy = this.modelutilities.generateGuid();
        // post the record
        let await = this.modal.await('LBL_SAVING');
        this.backend.postRequest(`admin/gdprmanager/retentionpolicies/${this.selectedPolicy.id ? this.selectedPolicy.id : newPolicy}`, {}, this.selectedPolicy).subscribe(
            () => {
                if (!this.selectedPolicy.id) this.selectedPolicy.id = newPolicy;
                await.emit(true);
            },
            () => {
                await.emit(true);
            }
        )
    }

    /**
     * gets the records to be changed for a policy
     *
     * @private
     */
    private getResults() {
        this.isloading = true;
        this.results.list = [];
        this.backend.getRequest(`admin/gdprmanager/retentionpolicies/${this.selectedPolicy.id}/results`).subscribe(
            res => {
                this.results = res;
                this.isloading = false;
            },
            () => {
                this.isloading = false;
            }
        );
    }

    /**
     * loads more results if that is applicable
     *
     * @private
     */
    private loadmore() {
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
    private openRecord(id, e: MouseEvent) {
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
    private deleteByIndex(index) {
        this.modal.confirm('LBL_DELETE_RECORD', 'LBL_DELETE_RECORD').subscribe(
            res => {
                if (res) {
                    if (this.selectedPolicy.id) {
                        let await = this.modal.await('LBL_DELETING');
                        this.backend.deleteRequest(`admin/gdprmanager/retentionpolicies/${this.selectedPolicy.id}`).subscribe(
                            res => {
                                this.deletePolicy(index);
                                await.emit(true);
                            },
                            () => {
                                await.emit(true);
                            }
                        )
                    } else {
                        this.deletePolicy(index);
                    }

                }
            }
        );
    }

    private deletePolicy(index) {
        if (this.selectedPolicyIndex == index) this.selectedPolicyIndex = undefined;
        this.policies.splice(index, 1);
    }

    /**
     * adds a new policy record
     *
     * @private
     */
    private addPolicy() {
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
                    this.selectedPolicyIndex = this.policies.length - 1;
                }
            }
        );
    }

}

