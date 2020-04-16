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

// Import Material UI Icons //
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

// Components //
import PopoverModif from "../popover/modif_popover";

// Containers //
import StatusUtilisateur from "../../redux/containers/statusUtilisateur";

export default class Liste extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: false
        };
    }

    render() {
        const { users } = this.state;

        return (
            <Grid
                className="App-List"
                container
                direction="row"
                justify="center"
                alignItems="center"
            >

                {users
                    ? <List>
                        <h2 className="titreListeUser">Listes des utilisateurs</h2>
                        {users.map(({ id, name, username }) => (
                            <Paper 
                                className="Paper" 
                                key={id}
                                onClick={() => { this.props.getUser(id) }}
                            >
                                <ListItem button>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="space-between"
                                        alignItems="center"
                                        wrap="nowrap"
                                    >
                                        <Link to="/info" className="Link_Info">
                                            <ListItemIcon>
                                                <ArrowForwardIosOutlinedIcon color="primary" fontSize="large" />
                                            </ListItemIcon>
                                            <ListItemIcon>
                                                <StatusUtilisateur id={id}/>
                                            </ListItemIcon>

                                            <ListItemText className="listItemtext">
                                                <p className="paragrapheListe">{name} {username}</p>
                                            </ListItemText>

                                        </Link>
                                        <PopoverModif />
                                    </Grid>
                                </ListItem>
                            </Paper>
                        ))}
                    </List>

                    : <p>Pas de connection a l'API</p>
                }
            </Grid>
        );
    }

    componentDidMount() {
        
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(json => this.setState({
            users : json
        }))
        .catch(function(error) {
            console.log('Il y a eu un problème avec l\'opération fetch des users : ' + error.message);
        });
    }
}