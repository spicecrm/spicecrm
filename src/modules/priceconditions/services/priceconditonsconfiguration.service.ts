/**
 * @module ModulePriceConditions
 */
import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';

declare var _: any;

@Injectable()
export class priceconditonsconfiguration {

    public config: any = {};

    constructor(
        private backend: backend,
        private configuration: configurationService,
    ) {
        // load the config
        this.getConfig();
    }

    /**
     * loads the config from the backend
     */
    private getConfig() {
        this.config = this.configuration.getData('priceconditonsconfiguration');
        if(_.isEmpty(this.config)) {
            this.backend.getRequest(`module/PriceConditions/configuration`).subscribe(config => {
                this.config = config;
                this.configuration.setData('priceconditonsconfiguration', config);
            });
        }
    }

}
