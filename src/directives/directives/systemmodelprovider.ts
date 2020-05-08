/**
 * @module DirectivesModule
 */
import {Directive, Input} from '@angular/core';
import {model} from "../../services/model.service";

/**
 * a directive that does nothing else but to provide a model service instance, populated by an model like object
 *
 * ```html
 * <tr *ngFor="let contact of contacts" [modelProvider]="{module:'Contacts', data: contact}">
 *     ...
 * </tr>
 * ```
 */
@Directive({
    selector: '[system-model-provider]',
    providers: [model]
})
export class SystemModelProviderDirective {
    constructor(
        private model: model
    ) {
        // in case the host component is listening to the loading status and waits for it!
        this.model.isLoading = true;
    }

    /**
     * as part of the attribute the model paramaters can be passed in
     *
     * @Input('modelProvider') provided_model:{
     *   module:string,
     *   id:string,
     *   data:any,
     *   };
     *
     * @param provided_model
     */
    @Input('system-model-provider')
    set provided_model(provided_model: { module: string, id: string, data: any }) {
        this.model.module = provided_model.module;
        if (provided_model.id) {
            this.model.id = provided_model.id;
        } else if (provided_model.data) {
            this.model.id = provided_model.data.id;
        }

        if (provided_model.data) {
            this.model.data = provided_model.data;
            this.model.isLoading = false;
            this.model.data$.next(this.model.data);

            if (provided_model.data.acl) {
                // has to be called again after the data is set because of the missing acl before...
                this.model.initializeFieldsStati();
            }
        } else if (this.model.id) {
            // if no data was found BUT an ID, load it from backend... isLoading will be set inside getData()
            this.model.getData();
        }

    }
}
