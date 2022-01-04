/**
 * @module ObjectComponents
 */
import { Component, ElementRef, Input, ViewChild, OnInit  } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {relatedmodels} from '../../services/relatedmodels.service';
import {language} from '../../services/language.service';
import { model } from '../../services/model.service';
import { metadata } from '../../services/metadata.service';

/**
 * the header in the object-related-card
 *
 * displays the header with icon for the module, the title, the count and a open/close trigger, and also an actionset
 */
@Component({
    selector: 'object-related-card-header',
    templateUrl: '../templates/objectrelatedcardheader.html',
    animations: [
        trigger('animateicon', [
            state('open', style({ transform: 'scale(1, 1)'})),
            state('closed', style({ transform: 'scale(1, -1)'})),
            transition('open => closed', [
                animate('.5s'),
            ]),
            transition('closed => open', [
                animate('.5s'),
            ])
        ])
    ],
})
export class ObjectRelatedCardHeader implements OnInit {

    /**
     * the component config as key paramater into the component
     */
    @Input() public componentconfig: any = {};

    /**
     * indicates if the panel is open ... this is checked fromt eh vcard to render the content or not
     */
    public isopen: boolean = true;

    /**
     * Reference to <ng-content></ngcontent>. Is needed in the template.
     */
    // @ViewChild('ngContent', {static:true}) public ngContent: ElementRef;

    constructor( public language: language, public relatedmodels: relatedmodels, public model: model, public metadata: metadata ) { }

    public ngOnInit(): void {
        if ( this.componentconfig.collapsed ) {
            // use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => this.isopen = !this.componentconfig.collapsed);
        }
    }

    /**
     * a getter for the Title to be displayed. This either translates a tilte if set int he config or it renders the module name
     */
    get panelTitle() {
        if ( this.componentconfig.title ) return this.language.getLabel( this.componentconfig.title );
        if ( this.relatedmodels._linkName && this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName] && this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName].vname ) {
            return this.language.getLabel( this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName].vname );
        }
        return this.language.getModuleName( this.module );
    }

    /**
     * a getter to extract the actionset from the componentconfig
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * a getter to extract the module from the componentconfig
     */
    get module() {
        return this.componentconfig.object;
    }

    /**
     * toggle Open or Close the panel
     */
    public toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this.isopen = !this.isopen;
    }

    /**
     * triggers the reload of the related models service
     */
    public reload() {
        this.relatedmodels.getData();
    }

}
