import React, { Component } from 'react';

// Import Material UI //
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Components //
import PopoverList from "../popover/list_popover";
import Loader from "../loader/loader";

export default class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post : false,
            comments : false,
            isPostLoading : false,
            isCommentsLoading : false,
            isError : false,
            errorData : false
        };
    }

    render() {
        const { post, comments, isPostLoading, isCommentsLoading, isError, errorData } = this.state;

        return (
            <Grid
                className="App-Modif"
                container
                direction="row"
                justify="center"
                alignItems="center"
            >

                <Paper className="Paper">
            
                    {post
                        ? <section className="App-Section-Comments">
                            <h2>{post[0].title}</h2>
                            <p>{post[0].body}</p>

                            {comments 
                                ? <List >
                                    {comments.map(({ id, name, email, body }) => (
                                        <ListItem key={id}>
                                            <ListItemText className="listItemtext">
                                                <p><span>Nom : </span>{name}</p>
                                                <p><span>Email : </span>{email}</p>
                                                <p><span>Commentaire : </span>{body}</p>
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>

                                : !isError && !isCommentsLoading ? <p>Pas de comments</p> : null
                            }
                            
                        </section>

                        : !isError && !isPostLoading ? <p>Pas de personne sélectionnée</p> : null
                    }

                    { isPostLoading || isCommentsLoading ? <Loader /> : null }
                    { isError && <p>Erreur de chargement -> Données non accessibles : {errorData}</p> }

                </Paper>
            </Grid>
        );
    }

    componentDidMount() {
        this.setState({ isPostLoading : true });

        fetch('https://jsonplaceholder.typicode.com/posts?id=' + this.props.postId)
        .then(response => response.json())
        .then(json => {
            this.setState({ 
                post: json,
                isPostLoading: false
            });
            this._getComments();
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch du post : ' + err.message);
            this._displayError('message');
        });
    }

    _getComments() {
        this.setState({ isCommentsLoading: true });

        fetch('https://jsonplaceholder.typicode.com/comments?postId=' + this.props.postId)
        .then(response => response.json())
        .then(json => this.setState({ 
            comments: json,
            isCommentsLoading : false
        }))
        .catch((err) => {
            console.log('Problème avec l\'opération fetch des commentaires : ' + err.message);
            this._displayError('commentaires');
        });
    }

    _displayError(err) {
        this.setState({ 
            isError : true,
            isPostLoading : false,
            isCommentsLoading : false,
            errorData : err
        });
    }
}
