/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, Input, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {Observable, Subject} from "rxjs";

/**
 * the central dictionary Manager
 */
@Component({
    selector: 'dictionary-manager-delete-modal',
    templateUrl: '../templates/dictionarymanagerdeletemodal.html',
})
export class DictionaryManagerDeleteModal {

    /**
     * reference to the modal
     * @private
     */
    private self: any;

    /**
     * the label to be displayed
     */
    public message: string;


    /**
     * the subject to emit on
     * @private
     */
    private responseSubject: Subject<string>;

    public dropitem: boolean = false;


    public delete(){
        this.responseSubject.next(this.dropitem ? 'drop' : 'delete');
        this.close();
    }

    /**
     * close the modal
     */
    public close(){
        this.responseSubject.complete();
        this.self.destroy();
    }

}
