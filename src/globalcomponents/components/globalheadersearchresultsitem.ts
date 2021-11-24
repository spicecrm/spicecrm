/**
 * @module GlobalComponents
 */
import {
    Component, Input, EventEmitter,
    OnInit, Output
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {view} from '../../services/view.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

@Component({
    selector: '[global-header-search-results-item]',
    templateUrl: './src/globalcomponents/templates/globalheadersearchresultsitem.html',
    providers: [model, view],
    host: {
        "(click)": "navigateTo()"
    }
})
export class GlobalHeaderSearchResultsItem implements OnInit {
    /**
     * the input
     *
     * @private
     */
    @Input() private hit: any = {};

    /**
     * eits when selected
     * @private
     */
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * held internally --if set to true the click will not navigate to the record but emit the model
     *
     * @private
     */
    private _noNavigaton: boolean = false;

    /**
     * an attribute that can be set to hide the close button
     *
     * @param value
     */
    @Input('global-header-search-results-item-nonavigation') set noNavigaton(value) {
        if (value === false) {
            this._noNavigaton = false;
        } else {
            this._noNavigaton = true;
        }
    }

    /**
     * the main fieldset
     * @private
     */
    private mainfieldset: string;

    /**
     * the subfieldset displayed in the second line
     * @private
     */
    private subfieldsetfields: any[];

    constructor(private model: model, private view: view, private router: Router, private language: language, private metadata: metadata) {
        this.view.displayLabels = false;
        this.view.displayLinks = false;
    }

    public ngOnInit() {
        // backwards compatibility with elasic 6 and still supporting elastic 7
        this.model.module = this.hit._type == '_doc' ?  this.hit._source._module : this.hit._type;
        this.model.id = this.hit._id;

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);
        this.mainfieldset = componentconfig.mainfieldset;
        if(componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);

        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.hit._source);
    }


    /**
     * handles te navigation. If enabled navigates to the record, otherwise just emits the model
     *
     * @private
     */
    private navigateTo() {
        if(this._noNavigaton) {
            this.selected.emit(this.model);
        } else {
            this.selected.emit(true);
            this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
        }
    }

}
