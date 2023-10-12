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

    /**
     * Keep the language subscription the unsubscribe at component end.
     */
    public languageSubscription: Subscription = new Subscription();

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public configuration: configurationService) {
        super(model, view, language, metadata, router);
        // Keep the language subscription the unsubscribe at component end:
        this.languageSubscription = this.language.currentlanguage$.subscribe( () => this.translateAndSortOptions() );
    }

    public ngOnInit() {
        super.ngOnInit();

        this.getOptions();

        // if we have only one option set it
        if(this.options.length == 1){
            this.value = this.options[0].name;
        }
    }

    public getValue(): string {
        try {
            if (!this.value) return '';

            // find the option and try to translate the table
            let thisOption = this.options.find(itemtype => itemtype.name == this.value);
            if (thisOption && thisOption.vname) {
                return this.language.getLabel(thisOption.vname);
            } else {
                return this.value;
            }
        } catch (e) {
            return this.value;
        }
    }

    /**
     * loads the salesdoc types from the config
     *
     * if config setting without display only is set filter the document out that are display ony .. this is required for the creation of sales documents
     */
    public getOptions() {
        let salesdocTypes = this.configuration.getData('salesdoctypes');
        if ( _.isArray( salesdocTypes )) {
            if( this.fieldconfig.withoutdisplayonly ) {
                this.options = salesdocTypes.filter( salesdocType => salesdocType.displayonly == 0 );
            } else {
                this.options = salesdocTypes;
            }

            // filter by party
            if(this.model.getField('salesdocparty')){
                this.options = this.options.filter( salesdocType => salesdocType.salesdocparty == this.model.getField('salesdocparty') );
            }

            // filter by type
            if(this.model.getField('salesdoccategory')){
                this.options = this.options.filter( salesdocType => salesdocType.salesdoccategory == this.model.getField('salesdoccategory') );
            }

            this.translateAndSortOptions();
        }
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
