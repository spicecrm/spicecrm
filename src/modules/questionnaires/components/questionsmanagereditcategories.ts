/**
 * @module ModuleQuestionnaires
 */
import { Component, OnChanges, Input, Renderer2, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questions-manager-edit-categories',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditcategories.html'
})
export class QuestionsManagerEditCategories implements OnChanges,OnDestroy {

    @Input() public categorypool;
    @Input() public option: any; // {}
    @Output() public change = new EventEmitter();

    private selectedCategories = [];

    private listIsExpanded = false;
    private clickListener: any;

    private names = '';

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
