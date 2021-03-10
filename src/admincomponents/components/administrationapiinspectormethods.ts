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

    /**
     * sets a fixed with for the method badge and a color for the type of method
     *
     * @param method
     * @private
     */
    private getMethodStyle(method) {

        let color = 'inherit';

        switch (method) {
            case 'get':
                color = '#05628a';
                break;
            case 'post':
                color = '#f38303';
                break;
            case 'put':
                color = '#41b658';
                break;
            case 'delete':
                color = '#d83a00';
                break;
        }

        return {
            width: '100px',
            color: '#ffffff',
            background: color
        };
    }

    private test(apiMethod: any, e: MouseEvent){
        e.preventDefault();
        e.stopPropagation();

        this.modal.openModal('AdministrationApiInspectorMethodTest', true, this.injector).subscribe(modalRef => {
            modalRef.instance.apiMethod = apiMethod;
        });
    }

}
