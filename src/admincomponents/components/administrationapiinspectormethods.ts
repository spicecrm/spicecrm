import {Component} from '@angular/core';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: 'administration-api-inspector-methods',
    templateUrl: './src/admincomponents/templates/administrationapiinspectormethods.html'
})

export class AdministrationApiInspectorMethods {

    constructor(
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

}
