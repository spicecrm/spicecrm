/**
 * @module WorkbenchModule
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';
import {modelutilities} from '../../services/modelutilities.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * the api log viwer rendered as part of the admin setion in the system
 */
@Component({
    selector: 'apilog-config',
    templateUrl: '../templates/apilogconfig.html'
})
export class APIlogConfig {

    /**
     * the methods allowed for selection in teh filter
     * @private
     */
    public methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'PUT', 'SOAP', 'TRACE'];

    /**
     * the data loaded fromt he backend
     * @private
     */
    public entries: any[] = [];

    /**
     * the available logtables
     */
    public logtables: string[] = [];

    /**
     * inidcates that we are loading
     *
     * @private
     */
    public isLoading = false;

    constructor(public backend: backend, public modal: modal, public modelutilities: modelutilities, public toast: toast) {
        this.loadData();
    }

    /**
     * loads the data from teh backend
     *
     * @private
     */
    public loadData() {
        this.isLoading = true;
        this.backend.getRequest('admin/apilog/config').subscribe({
            next: (res) => {
                this.entries = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        })
        this.backend.getRequest('admin/apilog/logtables').subscribe({
            next: (res) => {
                this.logtables = res;
            }
        })
    }

    /**
     * adds an entry
     */
    public addEntry(){
        let id = this.modelutilities.generateGuid();
        let postData: any = {
            route: '*',
            method: '*',
            user_id: '*',
            ip: '*',
            direction: '*',
            is_active: 0
        }
        this.backend.postRequest(`admin/apilog/config/${id}`, {}, postData).subscribe({
            next: () => {
                postData.id = id;
                postData.editing = true;
                this.entries.push(postData);
            }
        })
    }

    /**
     * toggles a record active or inactive
     *
     * @param id
     */
    public toggleActive(id){
        let currentStatus = this.entries.find(e => e.id == id).is_active;
        this.backend.putRequest(`admin/apilog/config/${id}/activate/${currentStatus ? 0 : 1}`).subscribe({
            next: () => {
                this.entries.find(e => e.id == id).is_active = !currentStatus;
            }
        })
    }

    /**
     * deletes a record
     *
     * @param id
     */
    public delete(id){
        this.backend.deleteRequest(`admin/apilog/config/${id}`).subscribe({
            next: () => {
                this.entries.splice(this.entries.findIndex(e => e.id == id), 1);
            }
        })
    }

    /**
     * saves a record
     *
     * @param record
     */
    public save(record){
        let postData = {
            route: record.route,
            method: record.method,
            user_id: record.user_id,
            ip: record.ip,
            direction: record.direction,
            logtable: record.logtable,
            is_active: record.is_active
        }
        this.backend.postRequest(`admin/apilog/config/${record.id}`, {}, postData).subscribe({
            next: () => {
                record.editing = false;
            }
        })
    }

}
