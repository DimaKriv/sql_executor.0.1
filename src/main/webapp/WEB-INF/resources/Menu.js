class QueryMenuItem extends React.Component{
    constructor(props) {
        super(props);
    }

    render()  {
        var suffix = '';
        if (this.props.count !== null) {
            suffix = '(' + this.props.count + ')';
        }
        return e('li', {className: 'tab', style:{background: 'linear-gradient(180deg, white 90%, blue)'}}
            ,e('a', {className: this.props.itemState, onClick: this.props.menuFunct
                    , style: {textTransform: 'capitalize', color: 'black'}}
                , [e('i', {className: this.props.icon, key: 0, style: {float: 'left', color: this.props.color
                        , marginTop: '-6px'}},[])
                    , e('div', {key: 1}, this.props.text + suffix)]))
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e('nav', {style: {backgroundColor: 'white'}}, e('div', {className: 'nav-wrapper'}
            , e('div', {className: 'nav-content'}
                , e('ul', {className: 'tabs tabs-transparent left',
                    style: {}}, this.props.children))));
    }
}