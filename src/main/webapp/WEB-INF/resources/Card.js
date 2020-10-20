class Card extends React.Component {
    constructor(props) {
        super(props);
        this.data = React.createRef();
        this.state = {
            isHidT: true
        }
    }

    sendQuery() {
        console.log(this.data.current);
        fetch('http://localhost:8081/dojogradle/command',
            {method: 'POST', headers: {'Content-Type':'application/json'}
                , body: JSON.stringify({"command": this.data.current.value})})
            .then(res => res.json()).then(res => this.props.funct(res));
    }

    render() {
        return e('div', {className: "modal", id:"modal3"},
            [e('div', {className: "modal-content", key:0},
                [e('h5', {key: 0, style: {borderBottom: '1px solid grey'}}, 'New SQL statement'),
                    e('i', {key: 2, className: 'fa fa-comment-o fa-3x'
                        , style: {float: 'left', margin: '5px'}}),
                    e('p', {key: 3}, 'Please specify SQL statement execute')
                    ,e('textarea',{key: 1, ref: this.data, defaultValue: this.props.word})])
                , e('div', {className: 'modal-footer', key: 1}, [
                e('a', {key: 0, className: "modal-close modal-action btn", href: '#!'
                    , style: {marginRight: '5px'}}, 'Cancel')
                , e('a', {key: 1, onClick: () => this.sendQuery(), className: "modal-action modal-close btn"
                    , href: '#!'}, 'Confirm')])]);
    }
}