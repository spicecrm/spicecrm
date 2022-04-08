import {Component, Injector} from '@angular/core';
import {modal} from '../../services/modal.service';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: 'administration-api-inspector-methods',
    templateUrl: '../templates/administrationapiinspectormethods.html'
})

export class AdministrationApiInspectorMethods {

    constructor(
        public modal: modal,
        public injector: Injector,
        public apiinspector: administrationapiinspectorService
    ) {
    }

    public test(apiMethod: any, e: MouseEvent){
        e.preventDefault();
        e.stopPropagation();

        this.modal.openModal('AdministrationApiInspectorMethodTest', true, this.injector).subscribe(modalRef => {
            modalRef.instance.apiMethod = apiMethod;
        });
    }

}
