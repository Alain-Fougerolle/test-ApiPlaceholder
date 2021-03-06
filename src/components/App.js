import React, { Component } from 'react';

// Typo et Css //
import 'typeface-roboto';
import "../assets/styles/App.scss";

// React Route //
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// Components //
import { Liste, Info, Modif, Post, NotFound } from './pages';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId :  false,
            postId :  false
        };

        this.getUser = this.getUser.bind(this);
        this.getPost = this.getPost.bind(this);
    }

    getPost(id) {
        this.setState({ postId : id });
    }

    getUser(id) {
        this.setState({ userId: id });
    }

    render() {       
        const { userId, postId } = this.state;

        return (
            <div className="App">
                <Router>
                    <Switch>

                        <Route exact path="/">
                            <Redirect to="/liste" />
                        </Route>

                        <Route path="/liste">
                            <Liste getUser = {this.getUser} />
                        </Route>

                        <Route path="/info">
                            {userId
                                ? <Info 
                                    userId = {userId} 
                                    getPost = {this.getPost} 
                                />
                                : <Redirect to = "/liste" />
                            }
                        </Route>

                        <Route path="/modif">
                            {userId
                                ? <Modif userId = {userId} />
                                : <Redirect to = "/liste" />
                            }
                        </Route>

                        <Route path="/post">
                            {postId                                
                                ? <Post postId = {postId} />
                                : <Redirect to = "/liste" />
                            }
                        </Route>

                        <Route path="*">
                            <NotFound />
                        </Route>
                        
                    </Switch>
                </Router>
            </div>
        );
    }
}