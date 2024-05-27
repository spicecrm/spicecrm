/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value with percentage
 */
@Component({
    templateUrl: '../templates/reporterfieldpercentage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldPercentage {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};

}
