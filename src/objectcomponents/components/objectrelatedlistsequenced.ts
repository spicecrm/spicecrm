/**
 * @module ObjectComponents
 *
 * @deprecated
 * Use ObjectRelatedlistList instead.
 */

import { Component, Input } from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {ObjectRelatedlistList} from './objectrelatedlistlist';

@Component({
    selector: 'object-relatedlist-sequenced',
    templateUrl: '../templates/objectrelatedlistsequenced.html'
})
export class ObjectRelatedlistSequenced {
    @Input() public componentconfig: any = {};
}
