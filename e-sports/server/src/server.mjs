// const express = require('express');

import express, { response } from 'express';

const app = express();

//  www.minhaapi.com -> /...
app.get('/ads', (request, response) => {
	// console.log('Acessou Ads!');
	// return response.send('Acessou Ads!');
	return response.json([
		{ id: 1, name: 'Anúncio 1' },
		{ id: 2, name: 'Anúncio 2' },
		{ id: 3, name: 'Anúncio 3' }
	]);
});

// localhost: porta 3333/ads
app.listen(3333);
