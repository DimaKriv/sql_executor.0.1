class Result extends React.Component{
    constructor(props) {
        super(props);
    }

    getResultColor() {
        if (this.props.state === 'Error') return 'red';
        if (this.props.state === 'Success') return 'green';
        return 'blue';
    }

    jsonToTable(json) {
        var tableEl = [];
        var trTh = [];
        var header = [];
        if (json === null) return tableEl;
        var keys = Object.keys(json);
        for(var i = 0; i < keys.length; i++) {
            trTh.push(e('th', {key: i}, keys[i].toString()));
            header.push(keys[i].toString());
        }
        tableEl.push(e('thead', {key: 0}, e('tr',{}, trTh)));
        var body = [];
        for(var i = 0; i < json[header[0]].length; i++) {
            var trTd = [];
            for (var j = 0; j < header.length; j++) {
                trTd.push(e('td', {key: j}, json[header[j]][i]));
            }
            body.push(e('tr' , {key: i}, trTd));
        }
        tableEl.push(e('tbody', {key: 1}, body));
        return tableEl;
    }

    render() {
        var json = this.props.data;
        return e('div', {className: "modal", id:"modal4"},
            e('div', {className: "modal-content", style: {padding: '1px'}}, [
                e('h5', {key: 0, style: {backgroundColor: this.getResultColor(), color:'white'
                        , margin: '0px', padding: '5px'}}, this.props.state)
                , e('table', {key: 1, style: {marginBottom: '2%', marginLeft:'2%'
                        , marginTop: '1%', width: '96%', border: '1px solid grey'}}, this.jsonToTable(json))]));

    }
}