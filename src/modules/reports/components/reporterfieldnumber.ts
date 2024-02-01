/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value
 */
@Component({
    templateUrl: '../templates/reporterfieldnumber.html'
})
export class ReporterFieldNumber {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};
}

