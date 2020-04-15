import React from 'react';
import { useLocation } from "react-router-dom";
import Grid from '@material-ui/core/Grid';

export default function NotFound() {
	let location = useLocation();

	return (
		<Grid
			className="App-Main-Tarif"
			container
			direction="row"
			justify="center"
			alignItems="center"
		>
			<h2>404: NOT FOUND</h2>
			<h3>
				Vous avez référez la mauvaise adresse, aucun match pour <code>{location.pathname}</code>
			</h3>
		</Grid>
	);
}