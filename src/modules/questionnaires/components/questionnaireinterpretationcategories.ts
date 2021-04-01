/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    private listIsExpanded = false;
    private sectionIsOpen = true;

    private hasFocus = false;

    private allCategories = [];
    private allCategoryNamesUpper = [];

    private selectedCategories = [];

    private presentedCategories = [];
    private numPresentedCategories = 0;

    private clickListener: any;

    @ViewChild('inputField', {read: ViewContainerRef, static: true}) private inputField: ViewContainerRef;

    constructor( private language: language, private model: model, private view: view, private backend: backend, private renderer: Renderer2 ) { }

    private get editing(): boolean {
        return this.view.isEditMode();
    }

    public ngOnInit(): void {
        this.backend.getRequest('QuestionOptionCategories/getList').subscribe(( response: any ) => {
            this.allCategories = response;
            this.allCategories.forEach( ( category, i ) => {
                this.allCategoryNamesUpper[i] = category.name.toUpperCase() + ' [' + category.abbreviation.toUpperCase() + ']';
            });
        });
    }

    private get selectedCategories2(): any[] {
        this.selectedCategories = [];
        if ( this.model.data.categories && this.model.data.categories != '' ) {
            let categorypool = this.model.data.categories.split(',');
            for ( let category of this.allCategories ) {
                for ( let categoryId of categorypool ) {
                    if ( category.id === categoryId ) this.selectedCategories.push( category );
                }
            }
        }
        return this.selectedCategories;
    }

    private deselectCategory( i: number ): void {
        this.selectedCategories.splice( i, 1 );
        this.model.data.categories = this.makeCategoryString();
    }

    private selectCategory( i: number ): void {
        if ( this.selectedCategories.indexOf( this.allCategories[i] ) === -1 ) {
            this.selectedCategories.push( this.allCategories[i] );
            this.model.data.categories = this.makeCategoryString();
            this.selectedCategories.sort( ( a: any, b: any ): number => {
                const an = a.name.toLocaleLowerCase();
                const bn = b.name.toLocaleLowerCase();
                return an > bn ? 1 : ( an === bn ? 0 : -1 );
            });
            if ( this.presentedCategories[i] === true ) {
                this.numPresentedCategories--;
                this.presentedCategories[i] = false;
            }
        }
    }

    private makeCategoryString(): string {
        let string = '';
        this.selectedCategories.some(( el ) => {
            string += ( ( string != '' ) ? ',':'' ) + el.id;
            return false;
        });
        return string;
    }

    private openList(): void {
        this.listIsExpanded = true;
        this.clickListener = this.renderer.listen('document', 'click', event => this.onClick(event));
    }
    private closeList(): void {
        this.listIsExpanded = false;
        if ( this.clickListener ) this.clickListener();
    }

    public onClick( event: MouseEvent ): void {
        if ( ! this.inputField.element.nativeElement.contains( event.target ) ) { // not clicked inside?
            this.listIsExpanded = false;
            this.clickListener();
        }
    }

    public ngOnDestroy() {
        if ( this.clickListener && this.clickListener.destroy ) this.clickListener.destroy();
    }

    private change( event=null ): void {
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

    private changeFocus( status: boolean, event = null ): void {
        if ( status ) this.change(event);
        // else this.listIsExpanded = false; // blur/focusverlust wird leider auch bei click in die liste verursacht
        this.hasFocus = status;
    }

    private setEditMode(): void {
        this.model.startEdit();
        this.view.setEditMode();
    }

    private toggleSection(): void {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    private getSectionStyle(): object {
        if ( !this.sectionIsOpen ) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

}
