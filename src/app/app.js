import React from 'react';
import ReactDOM from 'react-dom';

import * as RX from 'rxjs';

import axios from 'axios';
import * as DictionaryFunctions from '../shared/dictionary';

class AppComponent extends React.Component {

    constructor(props) {
        super(props);
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source();

        this.searchInputKeyUpHandler = this.searchInputKeyUpHandler.bind(this);
        this.searchInputChangenHandler = this.searchInputChangenHandler.bind(this);
        this.makeRequest = this.makeRequest.bind(this);



        this.state = {
            ...props,
            searchInput: '',
            searchInputKeyUpHandler: this.searchInputKeyUpHandler,
            searchInputChangenHandler: this.searchInputChangenHandler
        };

        this.trial = new RX.Subject();

        this.trial.debounceTime(400).distinctUntilChanged().subscribe(term => {
            this.makeRequest();
        })


    }
    searchInputChangenHandler(event) {
        let stateCP = Object.assign({}, this.state);
        stateCP.searchInput = event.target.value;
        this.setState(stateCP);
    }

    searchInputKeyUpHandler(event) {
        this.source.cancel();
        this.trial.next(this.state.searchInput);
    }

    makeRequest() {
        this.source.cancel();
        this.source = this.CancelToken.source();

        DictionaryFunctions.getDictionaryItemByTerm(this.state.searchInput, this.source)
            .then(
                data => {
                    let stateCP = Object.assign({}, this.state);
                    stateCP.result = data.result;
                    this.setState(stateCP);
                }
            )
            .catch(exception => {
                console.dir(exception);
            });
    }

    render() {
        let items = [];
        if (this.state.result && this.state.result.length) {
            items = this.state.result;
        }

        return (
            <div className="container-fluid" id="maincontainer" style={{ 'marginTop': '5px' }}>
                <div className="row">

                    <div className="col-md-2">
                        
                    </div>

                    <div className="col-md-8" style={{paddingTop: '5%'}}>
                        

                        <SearchInputForm {...this.state} />

                        <div id="result">
                            <div className="line_cnt">
                                {
                                    items.map((item, iterator) => {
                                        return <ResultItem key={iterator} {...item} />
                                    })
                                }

                            </div>

                        </div>

                        {
                            !items.length && 
                            <h1 style={{fontSize: '17px', marginTop: '5px', marginBottom: '5px'}}> 
                                ქართული განმარტებითი ლექსიკონი 
                                <small> შესულია 140 000  სიტყვაზე მეტი</small> 
                            </h1>
                        }

                    </div>

                    <div className="col-md-2">
                        
                    </div>

                </div>
            </div>
        );
    }
}

class ResultItem extends React.Component {
    render() {

        let type = '';
        switch (this.props.type) {
            case 'foreign':
                type = 'უცხო სიტყვათა ლექსიკონი'
                break;
            case 'civil':
                type = 'სამოქალაქო ლექსიკონი'
                break;
            case 'civil_education':
                type = 'სამოქალაქო განათლების ლექსიკონი'
                break;
            case 'universal_encyclopedia':
                type = 'უნივერსალური ენციკლოპედია'
                break;
            case 'botanic':
                type = 'ბოტანიკური ლექსიკონი'
                break;
            case 'geo-sulkhan-saba':
                type = 'სულხან-საბა: განმარტებითი ლექსიკონი'
                break;
            case 'metallurgy':
                type = 'მეტალურგიული ლექსიკონი'
                break;
            case 'library_terms':
                type = 'საბიბლიოთეკო ტერმინების ლექსიკონი'
                break;
            case 'maritime':
                type = 'საზღვაო ტერმინების ლექსიკონი'
                break;
            case 'medical':
                type = 'სამედიცინო ტერმინების ლექსიკონი'
                break;
            case 'grishashvili_tbilisuri':
                type = 'თბილისური ლექსიკონი'
                break;
            case 'geo_material_culture':
                type = 'ქართული მატერიალური კულტურის ლექსიკონი'
                break;
            case 'christianity':
                type = 'ქრისტიანული ლექსოკონი'
                break;

            default: break;
        }
        return (
            <React.Fragment>

                {
                    this.props.defAndSource.map((item, iterator) => {
                        return (
                            <React.Fragment key={iterator}>
                                <span className="word">
                                    <b>{this.props.term} </b>
                                </span>
                                <DefinitionAndSource {...item} />
                            </React.Fragment>
                        );

                    })
                }


                <div className="row" style={{ 'marginTop': '2px' }}>
                    <div className="col-md-12">
                        <div className="pull-left">
                        </div>
                        <div className="pull-right toolbox-fulltext">
                            Dictionary: <small> {type} </small>
                        </div>
                    </div>
                </div>

                <hr />
            </React.Fragment>
        )
    }
}

class DefinitionAndSource extends React.Component {
    render() {
        return (
            <React.Fragment>
                - {this.props.definition}

                <br />
                <br />
                {
                    this.props.source &&
                    <div className="row" style={{ 'marginTop': '2px' }}>
                        <div className="col-md-12">
                            <div className="pull-left">
                            </div>
                            <div className="pull-left toolbox-fulltext">
                                Source: <small> {this.props.source} </small>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

class SearchInputForm extends React.Component {

    render() {
        return (
            <div style={{ 'paddingLeft': '5px', 'paddingRight': '5px' }}>
                <div id="searchbox">
                    <form className="form-horizontal" role="form">
                        <div className="form-group has-feedback">
                            <div className="col-sm-12">
                                <input type="text"
                                    className="form-control searchbox"
                                    placeholder="Type word ..."
                                    value={this.props.searchInput}
                                    id="termInput"
                                    autocomplete="off"

                                    onKeyUp={this.props.searchInputKeyUpHandler}
                                    onChange={this.props.searchInputChangenHandler}
                                />
                                <span name="boxdefault" className="glyphicon glyphicon-search form-control-feedback" style={{ 'cursor': 'pointer', 'display': 'none' }}></span>
                                <span name="boxdelete" className="glyphicon glyphicon-remove form-control-feedback" style={{ cursor: 'pointer' }}></span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

class AdsImageLink extends React.Component {
    render() {
        return(
            <img src={this.props.src} alt="alt"  style={{width: '100%', height: '3%'}}/>
        );
    }
}
export default AppComponent;