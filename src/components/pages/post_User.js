import React, { Component } from 'react';

// React Route //
import { Link } from "react-router-dom";

// Import Material UI //
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

// Import Material UI Icons //
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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
            isAddCommentLoading : false,
            isError : false,
            errorData : false
        };
    }

    render() {
        const { post, comments, isPostLoading, isCommentsLoading, isAddCommentLoading, isError, errorData } = this.state;

        return (
            <Grid
                className="App-Modif"
                container
                direction="row"
                justify="center"
                alignItems="center"
            >

                <Paper className="Paper">
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                    >
                        <PopoverList />
                    
                        <Link to="/info">
                            <Button
                                id="buttonAnnulerUser"
                                variant="contained"
                                color="primary"
                            >
                                Retour profil
                            </Button>
                        </Link>
                    </Grid>
            
                    {post
                        ? <section className="App-Section-Comments">
                            <h2 className="title">{post[0].title}</h2>
                            <p className="post">{post[0].body}</p>

                            {comments 
                                ? <section> 
                                    <List >
                                        {comments.map(({ id, name, email, body }) => (
                                            <ListItem key={id}>

                                                <ListItemText className="listItemtext">
                                                    <p><span className="info">Nom : </span>{name}</p>
                                                    <p><span className="info">Email : </span>{email}</p>
                                                    <p><span className="info">Commentaire : </span>{body}</p>
                                                </ListItemText>

                                                <ListItemIcon>
                                                    <DeleteForeverIcon color="secondary" fontSize="large" onClick={() => { this._deleteComment(id) }} />
                                                </ListItemIcon>

                                            </ListItem>
                                        ))}
                                    </List>

                                    <h2 className="title">Ajouter un commentaire</h2>
                                    {!isAddCommentLoading
                                        ? <form id="formAddComment">
                                            <TextField className="textField" label="Nom" variant="outlined" name="nom" />
                                            <TextField className="textField" label="Email" variant="outlined" name="email" />
                                            <TextField className="textField commentaire" fullWidth label="Commentaire" variant="outlined" name="commentaire" />
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => { this._addComment() }}
                                                >
                                                    Poster
                                                </Button>
                                            </div>
                                        </form>
                                        : <Loader />
                                    }
                                </section>

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

    _deleteComment(id) {
        fetch('https://jsonplaceholder.typicode.com/comments/' + id, {
            method: 'DELETE'
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch delete du commentaire : ' + err.message);
        });

        let newComments = this.state.comments.filter(p => p.id !== id);
        this.setState({ comments : newComments });
    }

    _addComment() {
        let form = document.querySelector("#formAddComment");
        this.setState({ isAddCommentLoading : true });

        fetch('https://jsonplaceholder.typicode.com/comments', {
            method: 'POST',
            body: JSON.stringify({
                postId : this.props.postId,
                name :  form.nom.value,
                email : form.email.value,
                body :  form.commentaire.value 
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            let newComments = this.state.comments;
            newComments.push(json);
            this.setState({ 
                comments : newComments,
                isAddCommentLoading : false
            });
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch pour ajouter un commentaire : ' + err.message);
        });
    }
}
