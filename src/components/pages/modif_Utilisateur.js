import React, { Component } from 'react';

// React Route //
import { Link } from "react-router-dom";

// Import Material UI //
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Components //
import PopoverList from "../popover/list_popover";
import Loader from "../loader/loader";

export default class Modif extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: false,
            isUserLoading: false,
            isError: false,
            errorData: false
        };
    }

    render() {
        const { user, isUserLoading, isError, errorData } = this.state;

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
                        {this.props.userId
                            ? <Link to="/info">
                                <Button
                                    id="buttonAnnulerUser"
                                    variant="contained"
                                    color="primary"
                                >
                                    Annuler
                                </Button>
                            </Link>

                            : null
                        }
                    </Grid>
                    
                    {user
                        ? <form id="formModifUser">
                            <h2 className="titreModif">Modification des informations</h2>
                            <Grid
                                className="App-Modif"
                                container
                                direction="row"
                                justify="space-around"
                                alignItems="center"
                            >
                                <div className="containerInput">
                                    <TextField className="textField" label="Prenom" variant="outlined" name="prenom" defaultValue={user[0].name} />
                                    <TextField className="textField" label="Nom" variant="outlined" name="nom" defaultValue={user[0].username} />
                                </div>

                                <div className="containerInput">
                                    <TextField
                                        className="textField"
                                        label="Rue"
                                        variant="outlined"
                                        name="rue"
                                        fullWidth
                                        defaultValue={user[0].address.street}
                                    />
                                </div>

                                <div className="containerInput">
                                    <TextField className="textField" label="Code Postal" variant="outlined" name="codePostal" defaultValue={user[0].address.suite} />
                                    <TextField className="textField" label="Ville" variant="outlined" name="ville" defaultValue={user[0].address.city} />
                                </div>

                                <div className="containerInput">
                                    <TextField className="textField" label="Email" variant="outlined" name="email" defaultValue={user[0].email} />
                                    <TextField className="textField" label="Téléphone" variant="outlined" name="tel" defaultValue={user[0].phone} />
                                </div>

                                <Link to="/info">
                                    <Button
                                        id="buttonModifUser"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { this._updateUser() }}
                                    >
                                        Enregistrer
                                    </Button>
                                </Link>
                            </Grid>
                        </form>

                        : !isError && !isUserLoading ? <p>Pas de personne sélectionnée</p> : null
                    }

                    {isUserLoading && <Loader />}
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
        })
        .catch((err) => {
            console.log('Problème avec l\'opération fetch de user : ' + err.message);
            this._displayError('utilisateur');
        });
    }

    _updateUser() {
        let form = document.querySelector('#formModifUser');

        fetch('https://jsonplaceholder.typicode.com/users/' + this.props.userId, {
            method: 'PUT',
            body: JSON.stringify({
                id :            this.props.userId,
                name :          form.prenom.value,
                username :      form.nom.value,
                email :         form.email.value,
                address : {
                    street :    form.rue.value,
                    suite :     form.codePostal.value,
                    city :      form.ville.value
                },
                phone :         form.tel.value
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch((err) => {
            console.log('Problème avec l\'opération fetch de user : ' + err.message);
            this._displayError('mise a jour utilisateur');
        });
    }

    _displayError(err) {
        this.setState({
            isError: true,
            isUserLoading: false,
            errorData: err
        });
    }
}