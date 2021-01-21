import {createResourceTemplate} from '@dojo/framework/core/middleware/resources';

const resourceAddressPost: string = "http://localhost:9000/sql/execute";

export interface History {
    result: boolean,
    statement: string,
    exeDate: Date,
    exeTime: number
}

export interface HistoryBook {
    items: History[]
}


export const template = createResourceTemplate<History>({
    read: async(request, controls) => {
        const response = await fetch('http://localhost:9000/history', {method: 'GET'
            , headers: new Headers({'Content-Type': 'application/json'})});
        let tokens: History[] = [];
        const data = {
            data: tokens,
            total: 0};
        response.json().then(e => {
            let list: any[] =  e.histroryTokenList.tokens;
            for (let i = 0; i < list.length; i++) {
                let history: History = {
                    result:  list[i].executedSuccess,
                exeDate: new Date(list[i].executionDate),
                exeTime:  list[i].executionTime,
                statement: list[i].statement
                };
                data.data.push(history);
            }
            data.total = data.data.length;
            controls.put({ data: data.data, total: data.total }, request);
        });
        controls.put({ data: data.data, total: data.total }, request);
    },
    find: () => {}
});

async function postQueryJson(queryString:string) {
    let success = false;
      let message: (JSON| string) = await fetch(resourceAddressPost, {method: 'POST'
          , headers: {'Content-Type': 'text/plain'}, body: queryString}).then(
        (response) =>
            response.json()).then(j => {
                console.log(j.errors , j.data);
                console.log(j.errors.length);
          if (j.errors && j.errors.length > 0) {
              console.log(j.errors);
          return j.errors;
      } else {
             success = true;
             console.log(j.data);
             return  j.data;
         }
      }).catch((error) => {
        // console.log(error);
        return  error.toString()
      });
      // console.log({message, result:success});
      return {message, result:success};
}

export async function postQuery(queryString: string): Promise<{message: (string| JSON), result: boolean}> {
    return postQueryJson(queryString);
}


