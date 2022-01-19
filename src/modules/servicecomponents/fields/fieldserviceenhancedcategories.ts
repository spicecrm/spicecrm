/**
 * @module ObjectFields
 */
import {Component, ElementRef, Injector, Renderer2, SkipSelf} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {fieldCategories} from "../../../objectfields/components/fieldcategories";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'field-service-enhanced-categories',
    templateUrl: '../templates/fieldserviceenhancedcategories.html',
    providers: [model]
})
export class fieldServiceEnhancedCategories extends fieldCategories {

    constructor(
        @SkipSelf() public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public backend: backend,
        public config: configurationService,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        private queue: model
    ) {
        super(model, view, language, metadata, router, backend, config, elementRef, renderer);
    }

    public chooseCategories(selected) {
        super.chooseCategories(selected);

        // set the queue
        let addParams = JSON.parse(selected.category.add_params);
        if(addParams.servicequeue_id){
            this.queue.module = 'ServiceQueues';
            this.queue.id = addParams.servicequeue_id;
            this.queue.getData().subscribe(loaded => {
                this.model.setFields({
                    servicequeue_id: this.queue.id,
                    servicequeue_name: this.queue.getField('name')
                })
            })
        }
    }
}
