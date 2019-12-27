import { createStore, combineReducers, applyMiddleware, redux } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight, faSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import thunk from 'redux-thunk';
import axios from 'axios'


const CHANGE_QUOTE = "CHANGE_QUOTE";

const changeQuote = (quotes) => {
    return {
        type: CHANGE_QUOTE,
        quotes
    }
}

const quoteReducer = (state = {}, action) => {
    switch (action.type) {
        case CHANGE_QUOTE: console.log(action.quotes); return action.quotes[Math.floor(Math.random() * action.quotes.length)];
        default: return state;
    }
}

const fetchQuotes = () => {
    return function (dispatch) {
        axios.get('https://type.fit/api/quotes')
            .then(response => {
                const quotes = response.data;
                dispatch(changeQuote(quotes));
            })
    }
}

const store = createStore(quoteReducer, applyMiddleware(thunk));
store.dispatch(fetchQuotes());

class QuoteText extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        const quoteTextStyle = {
            fontSize: 40,
            
        }
        const iconStyle = {
            fontSize: 30,
            color: '#d9d9d9',
        }
        return (
            <div id="text" style={quoteTextStyle}>
                <FontAwesomeIcon style={iconStyle} icon={faQuoteLeft} /> {this.props.text} <FontAwesomeIcon style={iconStyle} icon={faQuoteRight} />
            </div>
        )
    }
}

class QuoteAuthor extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        const quoteAuthorStyle = {
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'flex-end',
            fontStyle: 'oblique'
        }
        return (
            <div id="author" style={quoteAuthorStyle}>
                - {this.props.author}
            </div>
        )
    }
}

class NewQuote extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.props.handleClick();
    }

    render() {
        const newQuoteStyle = {
            border: 'none',
            padding: '10px',
            outline: 'none',
            cursor: 'pointer',
            backgroundColor: '#d9d9d9',
            color: '#141E30',
            fontWeight: 'bold'
        }
        return (
            <button id='new-quote' style={newQuoteStyle} onClick={this.handleClick}>New quote</button>
        )
    }
}

class TweetQuote extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        const iconSize = {
            fontSize: 30
        }
        return (
            <a id='tweet-quote' href={`https://twitter.com/intent/tweet?text=${this.props.quote.text}%0A -${this.props.quote.author ? this.props.quote.author : 'Unknown'}`} target="_blank"><FontAwesomeIcon style={iconSize} icon={faTwitterSquare} color='#1DA1F2' /></a>
        )
    }
}

class Quote extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        const quoteStyle = {
            backgroundColor: '#fff',
            padding: 30,
            transition: '1s all ease-in-out',
            maxWidth: 350,
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,.1)'
        }
        const btnContainer = {
            display: 'flex',
            justifyContent: 'space-between'
        }
        return (
            <div id="quote-box" style={quoteStyle}>
                <QuoteText text={this.props.quote.text}/>
                <QuoteAuthor author={this.props.quote.author ? this.props.quote.author : 'Unknown'} />
                <div style={btnContainer}>
                    <TweetQuote quote={this.props.quote} />
                    <NewQuote handleClick={this.props.getNewQuote}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      quote: state
    }
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      getNewQuote: () => {
        dispatch(fetchQuotes());
      }
    }
  };
const Container = connect(mapStateToProps, mapDispatchToProps)(Quote);
class App extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Provider store={store}>
                <Container />
            </Provider>
        )
    }
}

const rootElement = document.getElementById('react-app');

render(<App />, rootElement);