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
import { Component, OnChanges, Input, Renderer2, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import { language } from '../../../services/language.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'questions-manager-edit-categories',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditcategories.html'
})
export class QuestionsManagerEditCategories implements OnChanges,OnDestroy {

    @Input() public categorypool;
    @Input() public option: any; // {}
    @Output() public change = new EventEmitter();
    @Input() public showLabel = false;

    private selectedCategories = [];

    private listIsExpanded = false;
    private clickListener: any;

    private names = '';

    /**
     * A unique ID for the component. Used for the attributes "id" and "for" in html elements.
     */
    private compId = _.uniqueId();

    constructor( private language: language, private renderer: Renderer2, private elementRef: ElementRef ) { }

    public ngOnChanges(): void {
        if ( this.categorypool.loaded ) this.doSelectedCategories();
        else {
            this.categorypool.event.subscribe( () => {
                this.doSelectedCategories();
            } );
        }
    }

    private doSelectedCategories(): void {
        this.selectedCategories.length = 0;
        for ( let listitem of this.categorypool.list ) {
            for ( let categoryId of this.option.categories.split( ',' )) {
                if ( listitem.id === categoryId ) this.selectedCategories.push( listitem );
            }
        }
        this.names = this.makeNameString();
    }

    private toggleList() {
        if ( this.listIsExpanded ) this.closeList();
        else this.openList();
    }
    private closeList() {
        this.listIsExpanded = false;
        if ( this.clickListener ) this.clickListener();
    }
    private openList() {
        this.listIsExpanded = true;
        this.clickListener = this.renderer.listen( 'document', 'click', event => this.onClick( event ));
    }

    public onClick( event: MouseEvent ): void {
        if ( ! this.elementRef.nativeElement.contains( event.target )) { // not clicked inside?
            this.listIsExpanded = false;
            this.clickListener();
        }
    }

    public ngOnDestroy(): void {
        if ( this.clickListener ) this.clickListener();
    }

    private toggleCategory( i: number ): void {
        if ( this.hasCategory(i) ) this.removeCategory(this.categorypool.list[i].id);
        else this.addCategory(i);
    }

    private addCategory( i: number ): void {
        this.selectedCategories.push( this.categorypool.list[i] );
        this.selectedCategories.sort( ( a: any, b: any ): number => {
            let an = a.name.toLocaleLowerCase();
            let bn = b.name.toLocaleLowerCase();
            return an > bn ? 1 : ( an === bn ? 0 : -1 );
        });
        this.option.categories = this.makeIdString();
        this.change.emit();
        this.names = this.makeNameString();
    }

    private removeCategory( id: string ): void {
        this.selectedCategories.some( ( category, i: number ) => {
            if ( id === category.id ) {
                this.selectedCategories.splice( i, 1 );
                return true;
            }
            return false;
        });
        this.option.categories = this.makeIdString();
        this.change.emit();
        this.names = this.makeNameString();
    }

    private hasCategory( i: number ): boolean {
        return this.selectedCategories.indexOf( this.categorypool.list[i] ) !== -1;
    }

    private makeIdString(): string {
        let string = '';
        this.selectedCategories.some( el => {
            string += ( ( string != '' ) ? ',':'' ) + el.id;
            return false;
        });
        return string;
    }

    private makeNameString(): string {
        let string = '';
        this.selectedCategories.some( el => {
            string += ( ( string != '' ) ? ', ':'' ) + el.name;
            return false;
        });
        return string;
    }

}
