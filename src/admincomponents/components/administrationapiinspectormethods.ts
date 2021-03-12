import {Component, Injector} from '@angular/core';
import {modal} from '../../services/modal.service';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: 'administration-api-inspector-methods',
    templateUrl: './src/admincomponents/templates/administrationapiinspectormethods.html'
})

export class AdministrationApiInspectorMethods {

    constructor(
        private modal: modal,
        private injector: Injector,
        private apiinspector: administrationapiinspectorService
    ) {
    }

    private test(apiMethod: any, e: MouseEvent){
        e.preventDefault();
        e.stopPropagation();

        this.modal.openModal('AdministrationApiInspectorMethodTest', true, this.injector).subscribe(modalRef => {
            modalRef.instance.apiMethod = apiMethod;
        });
    }

}
