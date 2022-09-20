// const express = require('express');

import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string';

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
	log: ['query']
});
// async / await
app.get('/games', async (request, response) => {
	const games = await prisma.game.findMany({
		include: {
			_count: {
				select: {
					Ads: true
				}
			}
		}
	});

	return response.json(games);
});

app.post('/games/:id/ads', async (request, response) => {
	const gameId = request.params.id;
	const body: any = request.body;

	const ad = await prisma.ad.create({
		data: {
			gameId,
			name: body.name,
			yearsPlaying: body.yearsPlaying,
			discord: body.discord,
			weekDays: body.weekDays.join(','),
			hourStart: convertHourStringToMinutes(body.hourStart),
			hourEnd: convertHourStringToMinutes(body.hourEnd),
			useVoiceChannel: body.useVoiceChannel
		}
	});

	return response.status(201).json(ad);
});

app.get('/games/:id/ads', async (request, response) => {
	const gameId = request.params.id;

	const ads = await prisma.ad.findMany({
		select: {
			id: true,
			name: true,
			weekDays: true,
			useVoiceChannel: true,
			yearsPlaying: true,
			hourStart: true,
			hourEnd: true
		},
		where: {
			gameId: gameId
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return response.json(
		ads.map((ad) => {
			return {
				...ad,
				weekDays: ad.weekDays.split(','),
				hourStart: convertMinutesToHourString(ad.hourStart),
				hourEnd: convertMinutesToHourString(ad.hourEnd)
			};
		})
	);
});

app.get('/ads/:id/discord', async (request, response) => {
	const adId = request.params.id;

	const ad = await prisma.ad.findUniqueOrThrow({
		select: {
			discord: true
		},
		where: {
			id: adId
		}
	});

	return response.json({
		discord: ad.discord
	});
});

// localhost: porta 3333/ads
app.listen(3333);

/*
const app = express();
/**params
 * Query: ... localhost:3333/ads?page=2&sort=title
 * Route: ... localhost:3333/ads/5  or localhost:3333/ads/como-criar-uma-api-em-node
* Body: enviar várias informações, formulários, escondidos.


//  HTTP methods / API Restful / HTTP Codes..
// GET, POST, PUT, PATCH, DELETE

//  www.minhaapi.com -> /...
app.get('/ads', (request, response) => {
	// console.log('Acessou Ads!');
	// return response.send('Acessou Ads!');
	return response.json([
		{ id: 1, name: 'Anúncio 1' },
		{ id: 2, name: 'Anúncio 2' },
		{ id: 3, name: 'Anúncio 3' },
		{ id: 4, name: 'Anúncio 4' }

	]);
});

*/
