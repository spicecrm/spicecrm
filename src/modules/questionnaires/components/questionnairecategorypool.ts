/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Renderer2, OnDestroy, ViewChild, ViewContainerRef, } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'questionnaire-category-pool',
    templateUrl: '../templates/questionnairecategorypool.html',
    styles:['.slds-pill { padding: 0.25rem 0.5rem }','.slds-pill:hover { background-color: inherit; }']
})
export class QuestionnaireCategoryPool implements OnInit, OnDestroy {

    public listIsExpanded = false;
    public sectionIsOpen = true;

    public hasFocus = false;

    public allCategories = [];
    public allCategoryNamesUpper = [];

    public selectedCategories = [];

    public presentedCategories = [];
    public numPresentedCategories = 0;

    public clickListener: any;

    @ViewChild('inputField', {read: ViewContainerRef, static: false}) public inputField: ViewContainerRef;

    constructor(public language: language, public model: model, public view: view, public backend: backend, public renderer: Renderer2 ) { }

    public get editing(): boolean {
        return this.view.isEditMode();
    }

    public ngOnInit(): void {
        this.backend.getRequest('module/QuestionOptionCategories/getList').subscribe(( response: any ) => {
            this.allCategories = response;
            for ( let category of this.allCategories ) {
                this.allCategoryNamesUpper.push( category.name.toUpperCase() + ' [' + category.abbreviation.toUpperCase() + ']' );
            }
        });
    }

    public get selectedCategories2(): any[] {
        this.selectedCategories = [];
        if ( this.model.data.categorypool && this.model.data.categorypool != '' ) {
            let categorypool = this.model.data.categorypool.split(',');
            this.allCategories.forEach( ( e, i ) => {
                for ( let categoryId of categorypool ) {
                    if ( this.allCategories[i].id === categoryId ) {
                        this.selectedCategories.push( this.allCategories[i] );
                    }
                }
            });
        }
        return this.selectedCategories;
    }

    public deselectCategory( i: number ): void {
        this.selectedCategories.splice( i, 1 );
        this.model.data.categorypool = this.makeCategoryString();
    }

    public selectCategory( i: number ): void {
        if ( this.selectedCategories.indexOf( this.allCategories[i] ) === -1 ) {
            this.selectedCategories.push( this.allCategories[i] );
            this.model.data.categorypool = this.makeCategoryString();
            this.selectedCategories.sort( ( a: any, b: any ): number => {
                let an = a.name.toLocaleLowerCase();
                let bn = b.name.toLocaleLowerCase();
                return an > bn ? 1 : ( an === bn ? 0 : -1 );
            });
            if ( this.presentedCategories[i] === true ) {
                this.numPresentedCategories--;
                this.presentedCategories[i] = false;
            }
        }
    }

    public makeCategoryString(): string {
        let string = '';
        this.selectedCategories.some( el => {
            string += ( ( string != '' ) ? ',':'' ) + el.id;
            return false;
        });
        return string;
    }

    public openList(): void {
        this.listIsExpanded = true;
        this.clickListener = this.renderer.listen('document', 'click', event => this.onClick(event));
    }
    public closeList(): void {
        this.listIsExpanded = false;
        if ( this.clickListener ) this.clickListener();
    }

    public onClick( event: MouseEvent ): void {
        if ( ! this.inputField.element.nativeElement.contains( event.target ) ) { // not clicked inside?
            this.listIsExpanded = false;
            this.clickListener();
        }
    }

    public ngOnDestroy(): void {
        if ( this.clickListener ) this.clickListener();
    }

    public change( event=null ): void {
        let target = event.target;
        if ( event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13 ) { // down, up, enter
            target.blur();
        } else {
            for ( let x = 0; x < this.allCategories.length; x++ ) this.presentedCategories[x] = false;
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

    public changeFocus( status: boolean, event = null ): void {
        if ( status ) this.change(event);
        // else this.listIsExpanded = false; // blur/focusverlust wird leider auch bei click in die liste verursacht
        this.hasFocus = status;
    }

    public setEditMode(): void {
        this.model.startEdit();
        this.view.setEditMode();
    }

    public toggleSection(): void {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    public getSectionStyle(): any {
        if ( !this.sectionIsOpen ) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

}
