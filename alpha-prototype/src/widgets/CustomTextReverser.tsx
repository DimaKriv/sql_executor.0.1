import {create, tsx} from '@dojo/framework/core/vdom';
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import * as css from "../App.m.css";
import icache from "@dojo/framework/core/middleware/icache";

const factory = create({icache});

let sentence:string = '';

function setSentence(value: string) {
    sentence = value;
}

export default factory(({middleware:{icache}})=>
{
    icache.getOrSet('reverse', '');
    return (<div classes={css.grid}>
        <CustomInput disabledCustom={false} onValFunc={setSentence}/>
        <CustomButton text={"Reverse words"} func={() =>
            fetch('http://localhost:9000/text/reverse/' + sentence).then(e => e.text()).then(text => {
            icache.set('reverse', text);
        })}/>
        <CustomInput disabledCustom={true} initValue={icache.get('reverse')}/>
        </div>)
});