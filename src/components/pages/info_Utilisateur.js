import React, { Component } from 'react';

// React Route //
import { Link } from "react-router-dom";

// Import Material UI //
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Import Material UI Icons //
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

// Components //
import PopoverList from "../popover/list_popover";
import PopoverModif from "../popover/modif_popover";
import Loader from "../loader/loader";

// Containers //
import StatusUtilisateur from "../../redux/containers/statusUtilisateur";
import ChangeStatus from "../../redux/containers/changeStatus";

export default class Info extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: false,
            posts: false,
            isUserLoading: false,
            isPostsLoading: false,
            isAddPostLoading: false,
            isError: false,
            errorData: false
        };
    }

    render() {
        const { user, posts, isPostsLoading, isUserLoading, isError, errorData, isAddPostLoading } = this.state;

        return (
            <Grid
                className="App-Info"
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
                        {user && <PopoverModif />}
                    </Grid>

                    {user
                        ? <section className="App-Section-Info">

                            <div className="titreInfo">
                                <StatusUtilisateur id={user[0].id} />
                                <h2 className="title">{user[0].name} {user[0].username}</h2>
                            </div>
                            <p><span className="InfoModifiable">Adresse : </span> {user[0].address.street} {user[0].address.suite} {user[0].address.city}</p>
                            <p><span className="InfoModifiable">email : </span> {user[0].email} </p>
                            <p><span className="InfoModifiable">tel : </span> {user[0].phone}</p>
                            <h3>Change status : <ChangeStatus id={user[0].id} /></h3>

                            <h2 className="title">Mes messages</h2>
                            {posts
                                ? <section className="section-Info">
                                    <List >
                                        {posts.map(({ id, title }) => (
                                            <ListItem
                                                button
                                                key={id}
                                                className= "ListItemInfo"
                                                onClick={() => { this.props.getPost(id) }}
                                            >
                                                {id !== 101
                                                    ? <Link to="/post">
                                                        <ListItemText className="listItemtext">
                                                            <p className="paragrapheListe">{title}</p>
                                                        </ListItemText>
                                                    </Link>

                                                    : <ListItemText className="listItemtext" onClick={() => { alert("Arrêter de cliquer dessus, ce post n'existe pas pour de vrai !") }}>
                                                        <p className="paragrapheListe">{title}</p>
                                                    </ListItemText>
                                                }

                                                <ListItemIcon>
                                                    <DeleteForeverIcon color="secondary" fontSize="large" onClick={() => { this._deletePost(id, title) }} />
                                                </ListItemIcon>
                                            </ListItem>
                                        ))}
                                    </List>

                                    <h2 className="title">Ajouter un message</h2>
                                    {!isAddPostLoading
                                        ? <form id="formAddPost">
                                            <TextField className="textField" label="Titre" variant="outlined" name="titre" />
                                            <TextField className="textField" label="Message" variant="outlined" name="message" />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => { this._addPost() }}
                                            >
                                                Poster
                                            </Button>
                                        </form>
                                        : <Loader />
                                    }
                                </section>

                                : !isError && !isPostsLoading ? <p>Pas de posts</p> : null
                            }

                        </section>

                        : !isError && !isUserLoading ? <p>Pas de personne sélectionnée</p> : null
                    }

                    {isUserLoading || isPostsLoading ? <Loader /> : null}
                    {isError && <p>Erreur de chargement -> Données non accessibles : {errorData}</p>}

                </Paper>
            </Grid>
        );
    }

    componentDidMount() {
        this.setState({ isUserLoading: true });

        fetch('https://jsonplaceholder.typicode.com/users?id=' + this.props.userId)
        .then(response => response.json())
        .then(json => {
            this.setState({
                user: json,
                isUserLoading: false
            });
            this._getPosts();
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch de user : ' + err.message);
            this._displayError('utilisateur');
        });
    }

    _getPosts() {
        this.setState({ isPostsLoading: true });

        fetch('https://jsonplaceholder.typicode.com/posts?userId=' + this.props.userId)
        .then(response => response.json())
        .then(json => this.setState({
            posts: json,
            isPostsLoading: false
        }))
        .catch((err) => {
            console.log('Problème avec l\'opération fetch des posts : ' + err.message);
            this._displayError('messages');
        });
    }

    _displayError(err) {
        this.setState({
            isError: true,
            isUserLoading: false,
            isPostsLoading: false,
            errorData: err
        });
    }

    _deletePost(id, title) {
        fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
            method: 'DELETE'
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch delete du post : ' + err.message);
        });

        let newPosts = this.state.posts.filter(p => p.title !== title);
        this.setState({ posts: newPosts });
    }

    _addPost() {
        let form = document.querySelector("#formAddPost");
        this.setState({ isAddPostLoading : true });

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title :  form.titre.value,
                body :   form.message.value,
                userId : this.props.userId
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            let newPosts = this.state.posts;
            newPosts.push(json);
            this.setState({ 
                posts : newPosts,
                isAddPostLoading : false
            });
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch pour ajouter un post : ' + err.message);
            this.setState({ isAddPostLoading : false });
            alert("L'envoie du message a échoué");
        });
    }
}