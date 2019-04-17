/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Renderer2, OnDestroy, ViewChild, ViewContainerRef, } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'questionnaire-interpretation-categories',
    templateUrl: './src/modules/questionnaires/templates/questionnaireinterpretationcategories.html',
    styles:['.slds-pill { padding: 0.25rem 0.5rem }','.slds-pill:hover { background-color: inherit; }']
})
export class QuestionnaireInterpretationCategories implements OnInit, OnDestroy {

    listIsExpanded: boolean = false;
    sectionIsOpen: boolean = true;

    hasFocus: boolean = false;

    allCategories = [];
    allCategoryNamesUpper = [];

    selectedCategories = [];

    presentedCategories = [];
    numPresentedCategories = 0;

    clickListener: any;

    @ViewChild('inputField', {read: ViewContainerRef}) inputField: ViewContainerRef;

    constructor(private language: language, private model: model, private view: view, private backend: backend, private renderer: Renderer2 ) { }

    get editing() {
        return this.view.isEditMode();
    }

    ngOnInit() {
        let params = {
            fields: JSON.stringify( ['id', 'name', 'abbreviation'] ),
            sortfield: 'name',
            limit: -99
        };
        this.backend.getRequest('module/QuestionOptionCategories', params).subscribe(( response: any ) => {
            this.allCategories = response.list;
            for ( let i=0; i<this.allCategories.length; i++)
                this.allCategoryNamesUpper[i] = this.allCategories[i].name.toUpperCase()+' ['+this.allCategories[i].abbreviation.toUpperCase()+']';
        });
    }

    get selectedCategories2() {
        this.selectedCategories = [];
        if ( this.model.data.categories && this.model.data.categories != '' ) {
            let categorypool = this.model.data.categories.split(',');
            for ( let i = 0; i < this.allCategories.length; i++ ) {
                for ( let categoryId of categorypool ) {
                    if ( this.allCategories[i].id === categoryId ) {
                        this.selectedCategories.push( this.allCategories[i] );
                    }
                }
            }
        }
        return this.selectedCategories;
    }

    deselectCategory(i:number) {
        this.selectedCategories.splice( i, 1 );
        this.model.data.categories = this.makeCategoryString();
        return;
    }

    selectCategory(i:number) {
        if ( this.selectedCategories.indexOf( this.allCategories[i] ) === -1 ) {
            this.selectedCategories.push( this.allCategories[i] );
            this.model.data.categories = this.makeCategoryString();
            this.selectedCategories.sort( function ( a:any, b:any ): number {
                let an = a.name.toLocaleLowerCase(), bn = b.name.toLocaleLowerCase();
                return an > bn ? 1 : ( an === bn ? 0 : -1 );
            });
            if ( this.presentedCategories[i] === true ) {
                this.numPresentedCategories--;
                this.presentedCategories[i] = false;
            }
        }
        return;
    }

    makeCategoryString():string {
        let string:string = '';
        this.selectedCategories.some(( el ) => {
            string += ( ( string != '' ) ? ',':'' ) + el.id;
            return false;
        });
        return string;
    }

    openList() {
        this.listIsExpanded = true;
        this.clickListener = this.renderer.listen('document', 'click', event => this.onClick(event));
    }
    closeList() {
        this.listIsExpanded = false;
        if ( this.clickListener ) this.clickListener();
    }

    public onClick( event: MouseEvent ): void {
        if ( ! this.inputField.element.nativeElement.contains( event.target ) ) { // not clicked inside?
            this.listIsExpanded = false;
            this.clickListener();
        }
    }

    ngOnDestroy() {
        if ( this.clickListener && this.clickListener.destroy ) this.clickListener.destroy();
    }

    change( event=null ) {
        let target = event.target;
        if ( event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13 ) { // down, up, enter
            target.blur();
        } else {
            for (let x = 0; x < this.allCategories.length; x++) this.presentedCategories[x] = false;
            this.numPresentedCategories = 0;
            this.allCategoryNamesUpper.some((el, i) => {
                if (target.value != '' && el.indexOf(target.value.toUpperCase()) > -1) {
                    if (this.presentedCategories[i] === false && this.selectedCategories.indexOf(this.allCategories[i]) === -1) {
                        this.numPresentedCategories++;
                        this.presentedCategories[i] = true;
                    }
                }
                return false;
            });
        }
        if ( !this.listIsExpanded && this.numPresentedCategories ) this.openList();
        if ( this.listIsExpanded && this.numPresentedCategories === 0 ) this.closeList();
    }

    changeFocus( status: boolean, event = null ) {
        if ( status ) this.change(event);
        // else this.listIsExpanded = false; // blur/focusverlust wird leider auch bei click in die liste verursacht
        this.hasFocus = status;
    }

    setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    toggleSection() {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    getSectionStyle() {
        if (!this.sectionIsOpen)
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            }
    }

}
