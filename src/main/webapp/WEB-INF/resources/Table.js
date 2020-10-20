class Table extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tabElements: [],
            countAllTElements: 0,
            countSuccessTElements: 0,
            countFailTElements: 0,
            showElements: [],
            isHid: true,
            resultState: false,
            resultData: null,
            word: "",
            interval: null
        };
        this.getAllTElements = this.getAllTElements.bind(this);
        this.getSuccessTElements = this.getSuccessTElements.bind(this);
        this.getFailTElements = this.getFailTElements.bind(this);
        this.addTElement = this.addTElement.bind(this);
        this.setResult = this.setResult.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.addTElementW = this.addTElementW.bind(this);
    }

    fetchData() {
        fetch('http://localhost:8081/dojogradle/history')
            .then(result => result.json())
            .then(result => {
                var array = [];
                result.map(el => e(TableElement, {statement: el['statement'], date: el['date']
                    , time: el['time'], key: el['id'], result: el['result'], funct: this.addTElementW}))
                    .forEach(el => array.push(el));
                var all = array.length;
                var success =  array.filter(el => el.props.result === true).length;
                var fail = array.filter(el => el.props.result === false).length;
                this.setState({tabElements: array, countAllTElements: all
                    , countSuccessTElements: success, countFailTElements: fail
                    ,showElements: array})
            })
    }

    componentDidMount() {
        var interval = setInterval(() => this.fetchData(), 10000);
        this.setState({interval: interval});
        this.fetchData();
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    getAllTElements() {
        this.setState({showElements: this.state.tabElements})
    }

    getSuccessTElements() {
        this.setState({showElements: this.state.tabElements.filter(el => el.props.result === true)})
    }

    getFailTElements() {
        this.setState({showElements: this.state.tabElements.filter(el => el.props.result === false)})
    }

    addTElement() {
        this.setState({word: ""});
        $('#modal3').modal('open');
    }

    addTElementW(word) {
        this.setState({word: word});
        $('#modal3').modal('open');
    }

    setResult(data) {
        this.setState({resultState: data.result});
        this.setState({resultData: data.data});
        $('#modal4').modal('open');
        this.fetchData();
    }

    render() {
        var headers = ['Statement', 'Executing Date', 'Executing Time'];
        var theaders = [];
        for (var i = 0; i < headers.length; i++) {
            theaders.push(e('th', {key: i + 20}, headers[i]));
        }
        var menu = ['All', 'Succeeded', 'Failed', 'Add new'];
        var menuIcon = ['', 'fa fa-circle', 'fa fa-circle', 'fa fa-plus'];
        var countAr = [this.state.countAllTElements, this.state.countSuccessTElements
            , this.state.countFailTElements, null];
        var menuFunct = [this.getAllTElements, this.getSuccessTElements, this.getFailTElements, this.addTElement];
        var menuItem = [];
        var menuIconColor = ['black','green', 'red', 'blue'];
        for (var i = 0; i < menu.length; i++) {
            if (i + 1 === menu.length) menuItem.push(e(QueryMenuItem,
                {key: i + 10, text: menu[i], icon: menuIcon[i], count: countAr[i], color: menuIconColor[i]
                    , menuFunct: menuFunct[i], className: 'modal-trigger btn', href: "#modal3"}));
            else menuItem.push(e(QueryMenuItem, {key: i + 10, text: menu[i], icon: menuIcon[i]
                , count: countAr[i], menuFunct: menuFunct[i], color: menuIconColor[i]}));
        }

        return e('div',{}, [
            e('div', {key:0}, e(Menu, {}, menuItem)),
            e('table', {key: 1}, [e('thead', {key: 2}, e('tr', {}, theaders))
                , e('tbody', {key: 3}
                    , this.state.showElements)]), e(Card, {key: 2, word: this.state.word, funct: this.setResult})
            , e(Result, {key: 3, state: this.state.resultState, data: this.state.resultData}),
            e('a', {key: 4, className: 'hide modal-trigger btn', href: '#modal4'})]);
    }
}

class TableElement extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        var data = [this.props.statement, new Date(this.props.date).toDateString(), this.props.time + ' ms'];
        var tds = [];
        var color = 'red';
        if(this.props.result) color = 'green';
        for (var i = 0; i < data.length; i++) {
            var element;
            if (i + 1 < data.length) {
                if (i === 0) element = e('td', {key: 0}, [e('i', {key:0, className:'fa fa-file'
                    , style: {marginRight: '5px', color: color}}), e('span', {key: 1}, data[0])],);
                else element = e('td', {key: i}, data[i]);
            } else {
                element = e('td', {key: i, className: 'row'},
                    [e('div',{key: 0, className: "col s6"}, data[i])
                        , e('i', {key: 1, className: 'fa fa-angle-right fa-2x offset-s4 col s1', onClick:
                            () => this.props.funct(data[0])})]);
            }
            tds.push(element);
        }
        return e('tr', {}, tds);
    }
}