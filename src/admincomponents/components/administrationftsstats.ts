/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {backend} from '../../services/backend.service';



@Component({
    templateUrl: './src/admincomponents/templates/administrationftsstats.html'
})
export class AdministrationFTSStats {

    private stats: any = {};

    public indices: any[] = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend

    ) {
        this.backend.getRequest('admin/elastic/stats').subscribe(stats => {
            this.stats = stats;

            for(let index in stats.indices) {
                this.indices.push({
                    name: index,
                    size: stats.indices[index].total.store.size_in_bytes,
                    documents: stats.indices[index].total.docs.count
                });
            }

            // sort
            this.indices.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

        });
    }
}
