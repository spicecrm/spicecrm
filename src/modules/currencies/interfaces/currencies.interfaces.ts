
export interface sysCurrency {
    id: string;
    iso4217: string;
    name: string;
    label?: string;
    currency_symbol?: string;
    is_inactive: number;
    is_systemcurrency: number;
    currency_isonumeric?: number;
    currency_precision?: number;
    exchange_rate?: number;
}

export interface sysCurrencyExchangeRate {
    exchangerate_date: any;
    exchange_rate: number;
}