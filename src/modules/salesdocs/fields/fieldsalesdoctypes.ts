/**
 * @module ModuleSalesDocs
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from '../../../services/configuration.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'field-salesdoc-types',
    templateUrl: '../templates/fieldsalesdoctypes.html'
})
export class fieldSalesdocTypes extends fieldGeneric {

    public options: any[] = [];

    public types: {[key: symbol | string]: any} = {};

    /**
     * Keep the language subscription the unsubscribe at component end.
     */
    public languageSubscription: Subscription = new Subscription();

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public configuration: configurationService) {
        super(model, view, language, metadata, router);
        // Keep the language subscription the unsubscribe at component end:
        this.languageSubscription = this.language.currentlanguage$.subscribe( () => this.translateAndSortOptions() );
        this.setTypes();
    }

    public ngOnInit() {
        super.ngOnInit();
        this.setOptions();

        // if we have only one option set it
        if(this.options.length == 1 && this.view.isEditMode()){
            this.value = this.options[0].name;
        }
    }

    /**
     * set the sales docs types
     * @private
     */
    private setTypes() {
        const types = this.configuration.getData('salesdoctypes');

        if (!_.isArray(types)) return;

        types.forEach(t => this.types[t.name] = t);
    }

    /**
     * display value
     */
    get displayValue(): string {
        return this.types[this.value]?.vname ?? this.value;
    }

    /**
     * loads the salesdoc types from the config
     *
     * if config setting without display only is set filter the document out that are display ony .. this is required for the creation of sales documents
     */
    private setOptions() {

        this.options = Object.values(this.types);

        if( this.fieldconfig.withoutdisplayonly ) {
            this.options = this.options.filter( salesdocType => salesdocType.displayonly == 0 );
        }

        // filter by party
        if(this.model.getField('salesdocparty')){
            this.options = this.options.filter( salesdocType => salesdocType.salesdocparty == this.model.getField('salesdocparty') );
        }

        // filter by type
        if(this.model.getField('salesdoccategory')){
            this.options = this.options.filter( salesdocType => salesdocType.salesdoccategory == this.model.getField('salesdoccategory') );
        }

        // check if we have to check ACL rights
        this.options.forEach((o, i) => {
            if(o.aclaction && !this.metadata.checkModuleAcl('SalesDocs', o.aclaction)){
                this.options.splice(i, 1);
            }
        })

        this.translateAndSortOptions();
    }

    /**
     * translates (and sorts) the salesdocstypes
     */
    public translateAndSortOptions() {
        this.options.forEach( option => option.vnameTrans = this.language.getLabel(option.vname));
        this.language.sortObjects( this.options, 'vnameTrans');
    }

    /**
     * Unsubscribe from language service.
     */
    public ngOnDestroy() {
        this.languageSubscription.unsubscribe();
    }

}
