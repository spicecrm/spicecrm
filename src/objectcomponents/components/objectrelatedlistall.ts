import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

declare var _;

@Component({
    selector: 'object-relatedlist-all',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistall.html',
    providers: [model, relatedmodels]
})
export class ObjectRelatedlistAll implements OnInit {

    module: string = '';
    id: string = '';
    link: string = '';
    related: string = '';
    fieldset: string = undefined;

    componentconfig: any = {};
    listfields: Array<any> = [];

    constructor(private activatedRoute: ActivatedRoute, private navigation: navigation, private language: language, private metadata: metadata, private model: model, private relatedmodels: relatedmodels) {

    }

    ngOnInit(){
        this.module = this.activatedRoute.params['value']['module'];
        this.link = this.activatedRoute.params['value']['link'];
        this.related = this.activatedRoute.params['value']['related'];
        this.fieldset = this.activatedRoute.params['value']['fieldset'];

        // set theenavigation paradigm
        this.navigation.setActiveModule(this.module);

        // get the bean details
        this.model.module = this.module;
        this.model.id = this.activatedRoute.params['value']['id'];



        this.model.getData(true, 'detailview').subscribe(data => {
            this.navigation.setActiveModule(this.module, this.model.id, data.summary_text);

        });

        // load the config and fieldset
        this.componentconfig = this.metadata.getComponentConfig('ObjectRelatedlistAll', this.related);
        // if nothing is defined, try to take the default list config...
        if(!this.componentconfig.fieldset)
            this.componentconfig = this.metadata.getModuleDefaultComponentConfigByUsage(this.related, 'list');

        if(_.isEmpty(this.componentconfig))
            console.warn(`no componentconfig found for ObjectRelatedlistAll nor ObjectList with module ${this.related}`);


        this.listfields = this.metadata.getFieldSetFields(this.fieldset ? this.fieldset : this.componentconfig.fieldset);
        if(_.isEmpty(this.listfields))
            console.warn('no fieldset to use!');

        // load the related data
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = this.activatedRoute.params['value']['related'];
        this.relatedmodels.loaditems = 50;
        this.relatedmodels.getData();
    }

    goModule(){
        this.model.goModule();
    }

    goModel(){
        this.model.goDetail();
    }

}