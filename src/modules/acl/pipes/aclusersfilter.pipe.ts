import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterACLUsers'
})
export class ACLUsersFilterPipe implements PipeTransform {

    transform(values: any[], filterString: string ): any[] {
        return values.filter( v => {
            return !filterString || v.user_name.toLowerCase().includes(filterString.toLowerCase());
        });
    }

}
