import {create, w} from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';

interface CustomProperties {
    disabledCustom: boolean
    onValFunc?: ((value?: any| undefined) => void)| undefined
    initValue?: string
}

const factory = create().properties<CustomProperties>();

export default factory(({properties}) => {
    const {disabledCustom, onValFunc, initValue} = properties();
    let initialValue:string = "";
    if (!disabledCustom) initialValue = "Put your input here!";
    return w(TextInput, {disabled: disabledCustom, onValue: onValFunc,  placeholder: initialValue
        , value: initValue})
});