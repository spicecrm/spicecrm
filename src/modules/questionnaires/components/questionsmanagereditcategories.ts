/**
 * @module ModuleQuestionnaires
 */
import { Component, OnChanges, Input, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questions-manager-edit-categories',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditcategories.html'
})
export class QuestionsManagerEditCategories implements OnChanges,OnDestroy {

    @Input() categorypool;
    @Input() option;

    selectedCategories = [];

    listIsExpanded = false;
    clickListener: any;

    names: string = '';

    constructor ( private language: language, private renderer: Renderer2, private elementRef: ElementRef ) { }

    ngOnChanges() {
        if ( this.categorypool.loaded ) this.doSelectedCategories();
        else
            this.categorypool.event.subscribe( () => {
                this.doSelectedCategories();
            });
    }

    doSelectedCategories() {
        this.selectedCategories.length = 0;
        for ( let i=0; i<this.categorypool.list.length; i++ )
            for ( let categoryId of this.option.categories.split(','))
                if ( this.categorypool.list[i].id === categoryId )
                    this.selectedCategories.push( this.categorypool.list[i] );
        this.names = this.makeNameString();
    }

    toggleList() {
        if ( this.listIsExpanded ) this.closeList();
        else this.openList();
    }
    closeList() {
        this.listIsExpanded = false;
        if ( this.clickListener ) this.clickListener();
    }
    openList() {
        this.listIsExpanded = true;
        this.clickListener = this.renderer.listen( 'document', 'click', event => this.onClick( event ));
    }

    public onClick( event: MouseEvent ): void {
        if ( ! this.elementRef.nativeElement.contains( event.target )) { // not clicked inside?
            this.listIsExpanded = false;
            this.clickListener();
        }
    }

    ngOnDestroy() {
        if ( this.clickListener && this.clickListener.destroy ) this.clickListener.destroy();
    }

    toggleCategory(i:number) {
        if ( this.hasCategory(i) ) this.removeCategory(this.categorypool.list[i].id);
        else this.addCategory(i);
    }

    addCategory(i:number) {
        this.selectedCategories.push( this.categorypool.list[i] );
        this.selectedCategories.sort( function( a:any, b:any ): number {
            let an = a.name.toLocaleLowerCase(), bn = b.name.toLocaleLowerCase();
            return an > bn ? 1 : ( an === bn ? 0 : -1 );
        });
        this.option.categories = this.makeIdString();
        this.names = this.makeNameString();
    }

    removeCategory(id:string) {
        this.selectedCategories.some( ( category, i:number ) => {
            if ( id === category.id ) {
                this.selectedCategories.splice( i, 1 );
                return true;
            }
            return false;
        });
        this.option.categories = this.makeIdString();
        this.names = this.makeNameString();
    }

    hasCategory(i:number) {
        return this.selectedCategories.indexOf( this.categorypool.list[i] ) !== -1;
    }

    makeIdString():string {
        let string:string = '';
        this.selectedCategories.some(( el ) => {
            string += ( ( string != '' ) ? ',':'' ) + el.id;
            return false;
        });
        return string;
    }

    makeNameString():string {
        let string:string = '';
        this.selectedCategories.some(( el ) => {
            string += ( ( string != '' ) ? ', ':'' ) + el.name;
            return false;
        });
        return string;
    }

}