import {create, tsx} from '@dojo/framework/core/vdom';
import * as css from "./styles/CustomDialog.m.css";
import TextInput from "@dojo/widgets/text-input";
import Button from "@dojo/widgets/button";
import Icon from "@dojo/widgets/icon";
import CustomDialog from "./CustomDialog";
import icache from "@dojo/framework/core/middleware/icache";
import {postQuery} from "../resource/SQLHistoryResource";

const buttonCss = {
    '@dojo/widgets/button': {
        root: [css.buttonRoot],
        label: [css.buttonLabel]
    },
    '@dojo/widgets/icon': {
        root: [css.iconHeader]
    }
};

interface DialogState {
    state: boolean,
    openResult: (message: (JSON| string), result: boolean) => void
    query?: string;
}

const helperText:string = "Insert SQL Statement";

const factory = create({ icache}).properties<DialogState>();

let questionPng = require('../icons/question.png');
let prevQuery: string|undefined = undefined;

export default factory(({properties, middleware:{ icache }}) => {
    const {state, openResult, query} = properties();
    if (prevQuery != query) {
        prevQuery = query;
        icache.set('value', query);
    }
    icache.getOrSet<boolean>('isDialogOpen', true);
    return (
        <CustomDialog maxWidth={550} headerTitle={"New  SQL statement"} state=
            {(state && !icache.getOrSet<boolean>('isDialogOpen', true))
            || (icache.getOrSet<boolean>('isDialogOpen', true) && !state)}>
        <div classes={[css.content]}>
            <img src={questionPng} alt="No" classes={css.contentImg}/>
            <div classes={css.contentText}>Please specify SQL statement to execute</div>
            <TextInput placeholder={helperText} initialValue={query} onValue={(value) => {
                icache.set('value', value);
            }}/>
            <div classes={css.buttonGroup}>
                <Button classes={buttonCss} onClick={() => {
                    icache.set('isDialogOpen',  !icache.get('isDialogOpen'));
                }}><Icon type="closeIcon" size="large"/>Cancel</Button>
                <Button classes={buttonCss} onClick={() => {
                     let value =  icache.get('value');
                     if (typeof value === 'string') {
                        postQuery(value).then(
                            ({message, result}) => {
                                openResult(message, result);
                                icache.set('isDialogOpen',  !icache.get('isDialogOpen'));
                            });
                     }
                    }
                }><Icon type="checkIcon" size="large"/>Confirm</Button>
            </div>
        </div>
        </CustomDialog>
    )
})

