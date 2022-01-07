/**
 * @module ModulePriceConditions
 */
import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {BehaviorSubject} from "rxjs";

declare var _: any;

@Injectable()
export class priceconditonsconfiguration {

    public config: any = {};

    public loaded$: BehaviorSubject<boolean>;

    constructor(
        public backend: backend,
        public configuration: configurationService,
    ) {
        this.loaded$ = new BehaviorSubject<boolean>(false);

        // load the config
        this.getConfig();
    }

    /**
     * loads the config from the backend
     */
    public getConfig() {
        this.config = this.configuration.getData('priceconditonsconfiguration');
        if(_.isEmpty(this.config)) {
            this.backend.getRequest(`configuration/priceconditions`).subscribe(config => {
                this.config = config;
                this.configuration.setData('priceconditonsconfiguration', config);
                this.loaded$.next(true);
            });
        } else {
            this.loaded$.next(true);
        }
    }

}
