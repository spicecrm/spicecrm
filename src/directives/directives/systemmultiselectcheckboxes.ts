/**
 * @module DirectivesModule
 */
import {AfterViewInit, Directive, ElementRef} from '@angular/core';

/**
 * A directive that can be added to an any HTML element that holds checkboxes in it. Then the user can check/uncheck multiple checkboxes simply by click/shift+click.
  */
@Directive({
    selector: '[system-multi-select-checkboxes]'
})
export class SystemMultiSelectCheckboxesDirective implements AfterViewInit {

    /**
     * The input HTML elements (type checkbox) are not visible. Instead the element label is visible (and clicks are made on the label).
     */
    private allLabels: any[];

    /**
     * The last checked label element.
     */
    private lastChecked: any;

    constructor( private elementRef: ElementRef ) { }

    public ngAfterViewInit() {
        this.allLabels = [];

        // The input HTML elements (type checkbox) are not visible. Instead the element label is visible (and clicks are made on the label).
        let labelElements = this.elementRef.nativeElement.getElementsByTagName('label');
        for ( let labelElement of labelElements ) {
            if ( labelElement.classList.contains('slds-checkbox__label')) {

                // Collect the label (checkbox):
                this.allLabels.push( labelElement );

                // The handler for a click or "shift-click" event:
                labelElement.addEventListener( 'click', event => {

                    // If this is the first click, lastChecked is undefined, so set it:
                    if( !this.lastChecked ) {
                        this.lastChecked = labelElement;
                        return;
                    }

                    // Click with shift key pressed:
                    if( event.shiftKey ) {
                        // Determine the start and the end of the range of checkboxes:
                        let startTemp = this.allLabels.indexOf( labelElement );
                        let endTemp = this.allLabels.indexOf( this.lastChecked );
                        let start = Math.min( startTemp, endTemp );
                        let end = Math.max( startTemp, endTemp );
                        // Determine the value to set to all the checkboxes:
                        let valueToSet = this.lastChecked.parentElement.getElementsByTagName( 'input' )[0].checked;
                        // Now set the value:
                        for( let i = start; i <= end; i++ ) {
                            this.allLabels[i].parentElement.getElementsByTagName( 'input' )[0].checked = valueToSet;
                            this.allLabels[i].parentElement.getElementsByTagName( 'input' )[0].dispatchEvent( new Event( 'change' ) );
                        }
                        // Prevent the system from handle a click so the value of the last (shift-clicked) checkbox won´t be inverted:
                        event.preventDefault();
                    }
                    // Remember the last checked checkbox for the next shift-click:
                    this.lastChecked = labelElement;
                });

            }
        }

    }

}
