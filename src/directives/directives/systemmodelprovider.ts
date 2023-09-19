/**
 * @module DirectivesModule
 */
import {Directive, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {model} from "../../services/model.service";
import {Subscription} from "rxjs";

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
    providers: [model],
    exportAs: 'system-model-provider'
})
export class SystemModelProviderDirective implements OnDestroy {
    /**
     * emit when the model data$ emits
     */
    @Output() public data$ = new EventEmitter<any>();
    /**
     * holds subscription to unsubscribe
     * @private
     */
    public subscription = new Subscription();

    constructor(
        public model: model
    ) {
        // in case the host component is listening to the loading status and waits for it!
        this.model.isLoading = true;

        this.subscription.add(
            this.model.data$.subscribe(data => this.data$.next(data))
        );
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
    set provided_model(provided_model: { module: string, id?: string, data: any, clone?: boolean }) {

        if (!provided_model.module) return;

        this.model.module = provided_model.module;
        this.model.id = provided_model.id;

        if (!provided_model.id && provided_model.data) {
            this.model.id = provided_model.data.id;
        }

        if (provided_model.data) {

            // if (provided_model.data.isNew) {
                this.model.initialize();
            // }

            // set the data
            this.model.setData(provided_model.clone === true ?  {...provided_model.data} : provided_model.data);

            // set to loading done
            this.model.isLoading = false;

        } else if (this.model.id) {
            // if no data was found BUT an ID, load it from backend... isLoading will be set inside getData()
            this.model.getData();
        } else {
            this.model.initialize();
            this.model.isLoading = false;
        }
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
