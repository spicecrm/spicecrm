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
    templateUrl: "./src/systemcomponents/templates/systemprogressbar.html",
    host: {
        style: 'display:block'
    }
})
export class SystemProgressBar {

    /**
     * The progress of completion.
     */
    @Input() private progress: number = 0;

    /**
     * The number of decimals (for the display of the progress of completion (and the total value)).
     */
    @Input() private decimals: number = 2;

    /**
     * The size (thickness) of the progress bar according to SLDS ('small', 'medium' or 'large').
     */
    @Input() private size = 'medium';

    /**
     * The total value.
     * When 'total' is not given, the input parameter 'progress' will be interpreted as percentage value.
     */
    @Input() private total: number = null;

    constructor( private lang: language, private userprefs: userpreferences ) { }

    /**
     * Has the progress value to be displayed in percent?
     * @private
     */
    private get displayPercents(): boolean {
        return this.total === null;
    }

    /**
     * Get the progress value, also when not defined yet.
     * @private
     */
    private get _progress(): number {
        return this.progress === undefined ? 0 : this.progress;
    }

    /**
     * Get the total value, also when not defined yet (then 0).
     * @private
     */
    private get _total(): number {
        return this.total === undefined ? 0 : this.total;
    }

    /**
     * Build the text describing the progress (e. g. '25 %' or '20/80').
     * @private
     */
    private get progressText(): string {
        let progress;
        if ( this.displayPercents ) progress = this._progress.toFixed( this.decimals )+' %';
        else progress = this._progress.toFixed( this.decimals )+'/'+this._total.toFixed( this.decimals );
        return progress.split('.').join( this.userprefs.toUse.dec_sep );
    }

    /**
     * Determine the width of the bar in percent for CSS.
     * @private
     */
    private get progressWidth(): number {
        if ( this.displayPercents ) return this._progress > 100 ? 100 : this._progress;
        else return ( this._progress > this._total ? this._total : this._progress ) / this._total * 100;
    }

    /**
     * Determine the proper SLDS class for the size (thickness of the bar).
     * @private
     */
    private get sizeClass(): string {
        return 'slds-progress-bar_'+this.size;
    }

}
