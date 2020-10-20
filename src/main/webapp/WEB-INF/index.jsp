<%@ page language="java" contentType="text/html; ISO-8859-1" %>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MySQL</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
    <script>
        const e = React.createElement;
    $(document).ready(function() {
       M.AutoInit();
    })
    </script>
</head>
<body>
<div id = "root"></div>
<script src="<c:url value="resources/Card.js"/>"></script>
<script src="<c:url value="resources/Menu.js"/>"></script>
<script src="<c:url value="resources/Result.js"/>"></script>
<script src="<c:url value="resources/Table.js"/>"></script>
<script>
    class Input extends React.Component {
        constructor(props) {
            super(props);
            this.input = React.createRef();
        }

        render() {
            if (this.props.disable !== undefined) {
                return e('input', {ref: this.input, className: 'col s9',style: {border: '2px solid #afcfd6'
                        , borderRadius: '2px'}, value: this.props.word,  disabled: 'disabled'});
            }
            return e('input', {ref: this.input, className: 'col s9',style: {border: '2px solid #afcfd6'
                    , borderRadius: '2px'}});
        }
    }

    class Button extends React.Component{
        constructor(props) {
            super(props);
        }

        render() {
            return e('a', {className: 'col s2 offset-s1 waves-effect waves-light btn'
                    ,style: {float: 'right', textTransform: 'capitalize'}, onClick: this.props.funct}
            , 'Reverse words');
        }
    }

    class Container extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                data: ''
            };
            this.reverseWord = this.reverseWord.bind(this);
            this.input = React.createRef();
        }

        reverseWord() {
            var data = this.input.current.input.current.value;
            fetch('http://localhost:8081/dojogradle/string?word=' + data)
                .then(response => response.text()).then(response => {
                    this.setState({data: response});
                    console.log(this.state.data);
                });
        }

        render() {
            return e('div', {style: {border: '5px solid #00677f'}}
            , [e('div', {key: 0, style: {backgroundColor: '#00677f'
                        , color: 'white', textAlign: 'center', marginBottom: '10px'}}
            , 'SQL Executor v0.1'),
                e('div', {key: 1, className: 'container'},
                    e('div', {className: 'row', style: {margin: '0px'}},
                    [e(Input, {key: 1, ref: this.input}), e(Button, {key: 2, funct: this.reverseWord})
                        , e(Input, {key: 3 , word: this.state.data, disable: true})]))
                , e(Table, {key: 2})])
        }
    }

    ReactDOM.render(e(Container),
    document.getElementById("root")
    );
</script>
</body>
</html>