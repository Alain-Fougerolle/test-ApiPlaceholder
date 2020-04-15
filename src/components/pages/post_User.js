import React, { Component } from 'react';
import PropTypes from 'prop-types';

// React Route //
import { Link } from "react-router-dom";

// Import Material UI //
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post : false,
            comments : false
        };
    }

    render() {
        return (
            <Grid
                className="App-Modif"
                container
                direction="row"
                justify="center"
                alignItems="center"
            >

                <Paper className="Paper">
            
                    
                    {this.props.user
                        ? <form id="formModifUser">
                            <h2 className="titreModif">Modification des informations</h2>
                            <Grid
                                className="App-Modif"
                                container
                                direction="row"
                                justify="space-around"
                                alignItems="center"
                            >
                         

                            </Grid>
                        </form>

                        : <p>Aucune Personne Sélectionner</p>
                    }

                </Paper>
            </Grid>
        );
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/posts?id=' + this.props.postId)
        .then(response => response.json())
        // .then(json => this.setState({ post: json }))
        .then(json => console.log(json))

        fetch('https://jsonplaceholder.typicode.com/comments?postId=' + this.props.postId)
        .then(response => response.json())
        // .then(json => this.setState({ comments: json }))
        .then(json => console.log(json))
    }
}
