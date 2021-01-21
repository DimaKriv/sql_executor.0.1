let failedScroll = require('./success-scroll.png');
import Icon from './IconInterface';

class FailedScroll extends Icon {
    iconLocation = failedScroll;
    sizedIcon() {
        let el = this.getIcon();
        el.setAttribute("width", '16px');
        el.setAttribute('height', '16px');
        return el;
    }

}

export default new FailedScroll();