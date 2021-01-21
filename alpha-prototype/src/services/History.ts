import {History} from "../resource/SQLHistoryResource";

export interface HistoryRepresent {
    result: boolean,
    statement: string,
    exeDate: string,
    exeTime: string

}

export function filter(index: number, data: History[]): HistoryRepresent[] {
    let filteredData: History[] = [];
    switch (index) {
        case(0): {
            filteredData = [...data];
            break;
        }
        case(1): {
            filteredData = data.filter((item) => item['result']);
            break;
        }
        case(2): {
            filteredData = data.filter((item) => !item['result']);
            break;
        }
        default: {
            return [];
        }
    }
    return  filteredData.map(item => {return {
        result: item.result, statement: item.statement
        , exeTime: item.exeTime + " " + "ms", exeDate:
            (!isNaN(item.exeDate.getTime()))?
            new Intl.DateTimeFormat(
            'sv-SE', {year: 'numeric', month: 'numeric'
                , day:'numeric', hour: 'numeric', minute:'numeric', second: 'numeric'}).format(item.exeDate).toString():
                'Invalid Date'
    }});
}

export function filtterCount(data: History[]) {
    let success = data.filter(e => e.result).length;
    return {all:data.length, success, failed:data.length - success};
}