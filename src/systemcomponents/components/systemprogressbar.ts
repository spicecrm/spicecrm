/**
 * @module SystemComponents
 */
import { Component, Input } from "@angular/core";
import { language } from "../../services/language.service";
import { userpreferences } from '../../services/userpreferences.service';

/**
 * Displays a progress bar.
 */
@Component({
    selector: "system-progress-bar",
    templateUrl: "../templates/systemprogressbar.html",
    host: {
        style: 'display:block'
    }
})
export class SystemProgressBar {

    /**
     * if set to true the text for the progress will not be displayed
     * @private
     */
    @Input() public hideText: boolean = false;

    /**
     * if set color the progress bar will be colorized
     * @private
     */
    @Input() public color: string;

    /**
     * The progress of completion.
     */
    @Input() public progress: number = 0;

    /**
     * The number of decimals (for the display of the progress of completion (and the total value)).
     */
    @Input() public decimals: number = 2;

    /**
     * The size (thickness) of the progress bar according to SLDS ('small', 'medium' or 'large').
     */
    @Input() public size = 'medium';

    /**
     * The total value.
     * When 'total' is not given, the input parameter 'progress' will be interpreted as percentage value.
     */
    @Input() public total: number = null;

    constructor( public lang: language, public userprefs: userpreferences ) { }

    /**
     * Has the progress value to be displayed in percent?
     * @private
     */
    public get displayPercents(): boolean {
        return this.total === null;
    }

    /**
     * Get the progress value, also when not defined yet.
     * @private
     */
    public get _progress(): number {
        return this.progress === undefined ? 0 : this.progress;
    }

    /**
     * Get the total value, also when not defined yet (then 0).
     * @private
     */
    public get _total(): number {
        return this.total === undefined ? 0 : this.total;
    }

    /**
     * Build the text describing the progress (e. g. '25 %' or '20/80').
     * @private
     */
    public get progressText(): string {
        let progress;
        if ( this.displayPercents ) progress = this._progress.toFixed( this.decimals )+' %';
        else progress = this._progress.toFixed( this.decimals )+'/'+this._total.toFixed( this.decimals );
        return progress.split('.').join( this.userprefs.toUse.dec_sep );
    }

    /**
     * Determine the width of the bar in percent for CSS.
     * @private
     */
    public get progressWidth(): number {
        if ( this.displayPercents ) return this._progress > 100 ? 100 : this._progress;
        else return ( this._progress > this._total ? this._total : this._progress ) / this._total * 100;
    }

    /**
     * Determine the proper SLDS class for the size (thickness of the bar).
     * @private
     */
    public get sizeClass(): string {
        return 'slds-progress-bar_'+this.size;
    }

}
