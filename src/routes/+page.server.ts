import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

import {
	getAllGamesWithPlayers,
	addGame,
	addGameResults,
	addPlayersIfNotExist
} from '$lib/server/db/utils';
import { setError, superValidate } from 'sveltekit-superforms';
import { addGameFormSchema } from './schema';
import { zod4 as zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(addGameFormSchema));

	// await addGame('Test Game', 'This is a test game', '2023-10-01T12:00:00Z').then((newGame) => {
	// 	console.log('Added new game:', newGame);
	// });

	// await addPlayersIfNotExist(['Alice', 'Bob', 'Charlie']).then((players) => {
	// 	console.log('Ensured players exist:', players);
	// });

	// await addGameResults(2, [
	// 	{ playerName: 'Alice', profitLoss: 50 },
	// 	{ playerName: 'Bob', profitLoss: -30 },
	// 	{ playerName: 'Charlie', profitLoss: -20 }
	// ]);

	const data = await getAllGamesWithPlayers();
	console.log('Data from load function:', data);
	// You can process the data here if needed before returning it to the page
	// For example, you might want to group players by game or format dates
	return {
		gamesWithPlayers: data,
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(addGameFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await addGame(form.data.gameName, 'Description', new Date().toISOString());
		} catch (error) {
			console.error('Error adding game:', error);
			return setError(form, 'gameName', 'Failed to add game', {
				status: 500
			});
		}

		return {
			form
		};
	}
};
