import {Pipe, PipeTransform} from '@angular/core';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

@Pipe({
    name: 'dictionaryManagerFilterItems',
    pure: true
})

export class DictionaryManagerFilterItemsPipe implements PipeTransform {

    /**
     * return a filtered list of the dictionary items
     * @param items
     * @param currentDictionaryDefinition
     * @param currentDictionaryItem
     * @param filterTerm
     * @param draftOnly
     */
    public transform(items: DictionaryItem[], currentDictionaryDefinition: string, currentDictionaryItem: string, filterTerm: string, draftOnly?: boolean): any {
        // return an empty array when no DictionaryDefinition is set
        if (!currentDictionaryDefinition) return [];

        const customItems = new Set(
            items.filter(item => item.scope === 'c' && item.sysdictionarydefinition_id === currentDictionaryDefinition).map(item => item.name)
        );

        return items.filter(item => {

            const isCurrentItem = item.id === currentDictionaryItem;
            const isGlobal = item.scope === 'g';
            const isNotCustomized = !customItems.has(item.name);
            const matchesFilterTerm = !filterTerm || item.name.toLowerCase().includes(filterTerm.toLowerCase());
            const matchesDefinition = item.sysdictionarydefinition_id === currentDictionaryDefinition;
            const matchesDraftFilter = !draftOnly || item.status === 'd';

            return isCurrentItem || (matchesDraftFilter && matchesFilterTerm && matchesDefinition && (!isGlobal || isNotCustomized));

        }).sort((a, b) => a.sequence > b.sequence ? 1 : -1);

    }
}