import {Component, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {relatedmodels} from "../../../services/relatedmodels.service";


@Component({
    selector: 'hcm-skill-manager-button',
    templateUrl : '../templates/hcmskillmanagerbutton.html'
})

export class HCMSkillManagerButton {

    constructor(
        public model: model,
        public relatedmodels: relatedmodels,
        public modal: modal,
        public backend: backend,
        public injector: Injector
    ) {

    }

    /**
     * disabled
     */
    get disabled(){
        return !this.relatedmodels.isloading && this.model.checkAccess('edit') ? false : true;
    }

    public execute() {
        // get the scopes
        let preparing = this.modal.await('LBL_PREPARING')
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/related/hcmjobprofilescopes?module=HCMJobProfileScopes&getcount=1&offset=0&limit=-99`).subscribe({
            next: (res) => {
                this.modal.openModal('HCMSkillManager', true, this.injector).subscribe({
                    next: (modalref) => {
                        let scopes = [];
                        for(let scope in res.list){
                            scopes.push(res.list[scope]);
                        }
                        modalref.instance.hcmProfileScopes = scopes;
                    }
                });
                preparing.emit(true);
            },
            error: () => {
                preparing.emit(true);
            }
        })

    }

}
