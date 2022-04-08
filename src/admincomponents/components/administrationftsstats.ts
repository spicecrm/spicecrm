/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';

@Component({
    templateUrl: '../templates/administrationftsstats.html'
})
export class AdministrationFTSStats {

    public stats: any = {};

    public indices: any[] = [];

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend
    ) {
        this.backend.getRequest('admin/elastic/stats').subscribe(stats => {
            this.stats = stats;

            for (let index in stats.indices) {
                this.indices.push({
                    name: index,
                    size: stats.indices[index].total.store.size_in_bytes,
                    documents: stats.indices[index].total.docs.count,
                    stored: stats.indexed[index].count,
                    unindexed: stats.indexed[index].unindexed,
                });
            }

            // sort
            this.indices.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

        });
    }

}
