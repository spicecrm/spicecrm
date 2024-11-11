/**
 * @module ModuleAccounts
 */
import {EventEmitter, Injectable} from "@angular/core";
import {backend} from '../../../services/backend.service';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
@Injectable()
export class aclobjectsmanager {

    public acltypes: any[] = [];
    public activeTypeId: string = '';
    public aclobjects: any[] = [];
    public _activeObjectId: string = '';
    public aclModules: string[] = [];

    public currentModel: model;

    public constructor(public backend: backend, public modal: modal, public toast: toast) {
        this.backend.getRequest('module/SpiceACLObjects/modules').subscribe({
            next: (acltypes) => {
                this.acltypes = acltypes;

                this.acltypes.sort((a, b) => {
                    return a.module > b.module ? 1 : -1;
                });

                // the filtered modules
                this.aclModules = this.acltypes.map(t => t.module).sort((a, b) => a.localeCompare(b));
            }
        });
    }

    get activeObjectId(){
        return this._activeObjectId
    }

    set activeObjectId(id){
        if(this.currentModel.isDirty()){
            this.modal.prompt('confirm', 'MSG_UNSAVED_DATA').subscribe({
                next: (r) => {
                    if (r){
                        // cancel the editing of the model
                        this.currentModel.cancelEdit();
                        // rwrite back the backup values also to the array held locally
                        this.aclobjects[this.aclobjects.findIndex(o => o.id == this.currentModel.id)] = this.currentModel.utils.spiceModel2backend(this.currentModel.module, this.currentModel.data);
                        // set the new id
                        this._activeObjectId = id;
                    } else {
                        this._activeObjectId = this.currentModel.id;
                    }
                }
            })
        } else {
            this.currentModel.cancelEdit();
            this._activeObjectId = id;
        }
    }

    get activeObjectStatus(){
        return this._activeObjectId ? this.aclobjects.find(o => o.id == this._activeObjectId).status : '';
    }

    /**
     * activate the acl object
     * @param objectid
     * @private
     */
    public activateObject(objectid) {
        if(objectid == this.currentModel.id && this.currentModel.data.status != 'r' && this.currentModel.isDirty()){
            this.modal.prompt('confirm', 'MSG_UNSAVED_DATA').subscribe({
                next: (r) => {
                    if (r){
                        // cancel the editing of the model
                        this.currentModel.cancelEdit();
                        // rwrite back the backup values also to the array held locally
                        this.aclobjects[this.aclobjects.findIndex(o => o.id == this.currentModel.id)] = this.currentModel.utils.spiceModel2backend(this.currentModel.module, this.currentModel.data);
                        // set the new id
                        this.doActivate(objectid);
                    }
                }
            })
        } else {
            // cancel the editing of the model
            this.currentModel.cancelEdit();

            // do the activation
            this.doActivate(objectid);
        }
    }

    private doActivate(objectid){

        this.modal.confirm('LBL_ACTIVATE_OBJECT', 'LBL_ACTIVATE_OBJECT').subscribe(
            res => {
                if (res) {
                    let awaitmodal = this.modal.await('LBL_ACTIVATING');
                    this.backend.postRequest('module/SpiceACLObjects/' + objectid + '/activation').subscribe({
                        next: (response) => {
                            this.aclobjects.find(o => o.id == objectid).status = 'r';
                            awaitmodal.emit(true);
                        },
                        error: (e) => {
                            this.toast.sendToast('ERROR activating Object', 'error');
                            awaitmodal.emit(true);
                        }
                    });
                }
            }
        )
    }

    /**
     * deactivate the acl object
     * @param objectid
     * @private
     */
    public deactivateObject(objectid) {
        this.modal.confirm('LBL_DEACTIVATE_OBJECT', 'LBL_DEACTIVATE_OBJECT').subscribe({
            next: (res) => {
                if (res) {
                    // cancel the editing of the model
                    this.currentModel.cancelEdit();
                    let awaitmodal = this.modal.await('LBL_DEACTIVATING');
                    this.backend.deleteRequest('module/SpiceACLObjects/' + objectid + '/activation').subscribe({
                        next: (response) => {
                            this.aclobjects.find(o => o.id == objectid).status = 'd';
                            awaitmodal.emit(true);
                        },
                        error: (e) => {
                            this.toast.sendToast('ERROR deactivating Object', 'error');
                            awaitmodal.emit(true);
                        }
                    });
                }
            }
        });
    }
}
