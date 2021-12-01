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
    templateUrl: '../templates/questionsmanagereditcategories.html'
})
export class QuestionsManagerEditCategories implements OnChanges,OnDestroy {

    @Input() public categorypool;
    @Input() public option: any; // {}
    @Output() public change = new EventEmitter();
    @Input() public showLabel = false;

    public selectedCategories = [];

    public listIsExpanded = false;
    public clickListener: any;

    public names = '';

    /**
     * A unique ID for the component. Used for the attributes "id" and "for" in html elements.
     */
    public compId = _.uniqueId();

    /**
     * holds escape key listener
     * @private
     */
    public escKeyListener: any;

    constructor( public language: language, public renderer: Renderer2, public elementRef: ElementRef ) {
        this.escKeyListener = this.renderer.listen('document', 'keyup', (event: KeyboardEvent) => {
            if ( this.listIsExpanded && event.key === 'Escape' ) {
                this.listIsExpanded = false;
                event.stopImmediatePropagation();
            }
        });
    }

    public ngOnChanges(): void {
        if ( this.categorypool.loaded ) this.doSelectedCategories();
        else {
            this.categorypool.event.subscribe( () => {
                this.doSelectedCategories();
            } );
        }
    }

    public doSelectedCategories(): void {
        this.selectedCategories.length = 0;
        for ( let listitem of this.categorypool.list ) {
            for ( let categoryId of this.option.categories.split( ',' )) {
                if ( listitem.id === categoryId ) this.selectedCategories.push( listitem );
            }
        }
        this.names = this.makeNameString();
    }

    public toggleList() {
        if ( this.listIsExpanded ) this.closeList();
        else this.openList();
    }
    public closeList() {
        this.listIsExpanded = false;
        if ( this.clickListener ) this.clickListener();
    }
    public openList() {
        this.listIsExpanded = true;
        this.clickListener = this.renderer.listen( 'document', 'click', event => this.onClick( event ));
    }

    public onClick( event: MouseEvent ): void {
        if ( ! this.elementRef.nativeElement.contains( event.target )) { // not clicked inside?
            this.listIsExpanded = false;
            this.clickListener();
        }
    }

    public toggleCategory( i: number ): void {
        if ( this.hasCategory(i) ) this.removeCategory(this.categorypool.list[i].id);
        else this.addCategory(i);
    }

    public addCategory( i: number ): void {
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

    public removeCategory( id: string ): void {
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

    public hasCategory( i: number ): boolean {
        return this.selectedCategories.indexOf( this.categorypool.list[i] ) !== -1;
    }

    public makeIdString(): string {
        let string = '';
        this.selectedCategories.some( el => {
            string += ( ( string != '' ) ? ',':'' ) + el.id;
            return false;
        });
        return string;
    }

    public makeNameString(): string {
        let string = '';
        this.selectedCategories.some( el => {
            string += ( ( string != '' ) ? ', ':'' ) + el.name;
            return false;
        });
        return string;
    }

    /**
     * remove Escape key listener
     */
    public ngOnDestroy() {
        if ( this.escKeyListener ) this.escKeyListener();
    }

}
