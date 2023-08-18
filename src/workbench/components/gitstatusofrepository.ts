import {Component, OnInit} from '@angular/core';
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'git-status-of-repository',
    templateUrl: '../templates/gitstatusofrepository.html'
})
export class GitStatusOfRepository implements OnInit {
    ngOnInit(): void {
    this.gitStatusRepository();

    }

    constructor(public backend: backend, public toast: toast, public modal: modal) {

    }

    public data: any;

    public gitStatusRepository() {
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.postRequest(`admin/repair/status`, null).subscribe((res: any) => {
            this.data = res.output;
            loadingModal.emit(true);
        });
    }
}