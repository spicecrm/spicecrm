/**
 * @module DirectivesModule
 */
import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * A directive that can be added to an any HTML element that holds checkboxes in it. Then the user can check/uncheck multiple checkboxes simply by click/shift+click.
  */
@Directive({
    selector: '[system-multi-select-checkboxes]'
})
export class SystemMultiSelectCheckboxesDirective {

    /**
     * The last checked label element.
     */
    public lastChecked: any;

    constructor( public elementRef: ElementRef ) { }

    @HostListener('click', ['$event'])
    public onClick( event ) {

        let labelElement = null;
        if ( event.target.parentElement.classList?.contains('slds-checkbox__label')) labelElement = event.target.parentElement;
        else if ( event.target.parentElement.parentElement?.classList?.contains('slds-checkbox__label')) labelElement = event.target.parentElement.parentElement;
        else if ( event.target.classList.contains('slds-checkbox__label')) labelElement = event.target;

        if ( labelElement ) {

            // As side effect clicking on the label would select text, so prevent that:
            document.getSelection().removeAllRanges();

            // If this is the first click, lastChecked is undefined, so set it:
            if( !this.lastChecked ) {
                this.lastChecked = labelElement;
                return;
            }

            // Click with shift key pressed:
            if( event.shiftKey ) {

                let allLabels = this.getAllLabels();

                // Determine the start and the end of the range of checkboxes:
                let startTemp = allLabels.indexOf( labelElement );
                let endTemp = allLabels.indexOf( this.lastChecked );
                let start = Math.min( startTemp, endTemp );
                let end = Math.max( startTemp, endTemp );

                // Determine the value to set to all the checkboxes:
                let valueToSet = this.lastChecked.parentElement.getElementsByTagName( 'input' )[0].checked;

                // Now set the value:
                for( let i = start; i <= end; i++ ) {
                    allLabels[i].parentElement.getElementsByTagName( 'input' )[0].checked = valueToSet;
                    allLabels[i].parentElement.getElementsByTagName( 'input' )[0].dispatchEvent( new Event( 'change' ) );
                }

                // Prevent the system from handle a click so the value of the last (shift-clicked) checkbox won´t be inverted:
                event.preventDefault();
            }

            // Remember the last checked checkbox for the next shift-click:
            this.lastChecked = labelElement;

        }
    }

    /**
     * The input HTML elements (type checkbox) are not visible. So we need the labels.
     */
    public getAllLabels() {
        let allLabels = [];
        let labelElements = this.elementRef.nativeElement.getElementsByTagName( 'label' );
        for( let labelElement of labelElements ) {
            if ( labelElement.classList.contains('slds-checkbox__label') ) {
                // Collect the label (of checkbox):
                allLabels.push( labelElement );
            }
        }
        return allLabels;
    }

}
