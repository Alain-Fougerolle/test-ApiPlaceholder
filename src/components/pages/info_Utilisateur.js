import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Material UI //
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
            user : false,
            posts : false,
            isUserLoading : false,
            isPostsLoading : false,
            isError : false,
            errorData : false 
        };
    }

    render() {
        const { user, posts, isPostsLoading, isUserLoading, isError, errorData } = this.state;

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
                                <h2>{user[0].name} {user[0].username}</h2>
                            </div>
                            <p><span className="InfoModifiable">Adresse : </span> {user[0].address.street} {user[0].address.suite} {user[0].address.city}</p>
                            <p><span className="InfoModifiable">email : </span> {user[0].email} </p>
                            <p><span className="InfoModifiable">tel : </span> {user[0].phone}</p>
                            <ChangeStatus id={user[0].id} />

                            {posts 
                                ? <List >
                                    {posts.map(({ id, title }) => (
                                            <ListItem 
                                                button
                                                key={id}
                                                onClick={() => { this.props.getPost(id) }}
                                            >
                                                <ListItemText className="listItemtext">
                                                    <p className="paragrapheListe">{title}</p>
                                                </ListItemText>
                                            </ListItem>
                                    ))}
                                </List>

                                : !isError && !isPostsLoading ? <p>Pas de posts</p> : null
                            }

                        </section>

                        : !isError && !isUserLoading ? <p>Pas de personne sélectionnée</p> : null
                    }

                    { isUserLoading || isPostsLoading ? <Loader /> : null }
                    { isError && <p>Erreur de chargement -> Données non accessibles : {errorData}</p> }
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
            this._getPost();
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch de user : ' + err.message);
            this._displayError('utilisateur');
        });
    }

    _displayError(err) {
        this.setState({ 
            isError : true,
            isUserLoading : false,
            isPostsLoading : false,
            errorData : err
        });
    }

    _getPost() {
        this.setState({ isPostsLoading: true });

        fetch('https://jsonplaceholder.typicode.com/posts?userId=' + this.props.userId)
        .then(response => response.json())
        .then(json => this.setState({
            posts: json,
            isPostsLoading: false
        }))
        .catch((err) => {
            console.log('Problème avec l\'opération fetch de posts : ' + err.message);
            this._displayError('messages');
        });
    }
}