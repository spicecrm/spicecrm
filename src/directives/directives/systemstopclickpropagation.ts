/**
 * @module DirectivesModule
 */
import {Directive, HostListener} from "@angular/core";

/**
 * Stops the propagation of a click event.
 */
@Directive({
    selector: '[system-stop-click-propagation]',
})
export class SystemStopClickPropagationDirective {
    @HostListener("click", ["$event"])
    public onClick( event: any ): void
    {
        event.stopPropagation();
    }
}
