import {v} from '@dojo/framework/core/vdom';

abstract class Icon {
    abstract iconLocation: string;

    getIcon() {
        let el = document.createElement('img');
        el.setAttribute("src", this.iconLocation);
        return el;
    }

    getSizedIcon() {
        return this.getIcon();
    }

    get() {
        return this.getSizedIcon();
    }

    vi() {
        return v('img', {src: this.iconLocation})
    }
}

export default Icon;