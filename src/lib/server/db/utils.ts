import { games, players, gameResults } from './schema';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from './index'; // your drizzle db instance

export async function getAllGamesWithPlayers() {
	const rows = await db
		.select({
			gameId: games.id,
			gameName: games.gameName,
			gameDate: games.gameDate,
			playerName: players.playerName,
			profitLoss: gameResults.profitLoss
		})
		.from(games)
		.leftJoin(gameResults, eq(games.id, gameResults.gameId))
		.leftJoin(players, eq(players.id, gameResults.playerId))
		.orderBy(desc(games.gameDate), players.playerName);

	// Group by gameId
	const grouped = rows.reduce(
		(acc, row) => {
			let game = acc.find((g) => g.gameId === row.gameId);

			if (!game) {
				game = {
					gameId: row.gameId,
					gameName: row.gameName,
					gameDate: row.gameDate,
					results: []
				};
				acc.push(game);
			}

			// Add player result if present
			if (row.playerName) {
				game.results.push({
					playerName: row.playerName,
					profitLoss: row.profitLoss || 0
				});
			}

			return acc;
		},
		[] as {
			gameId: number;
			gameName: string;
			gameDate: string;
			results: { playerName: string; profitLoss: number }[];
		}[]
	);

	return grouped;
}

export async function addGame(gameName: string, notes?: string, date?: string) {
	const [newGame] = await db
		.insert(games)
		.values({
			gameName,
			notes: notes ?? null,
			gameDate: date ?? new Date().toISOString()
		})
		.returning({ id: games.id, gameName: games.gameName });

	return newGame;
}

export async function addPlayersIfNotExist(playerNames: string[]) {
	// Step 1: Find existing players
	const existing = await db.select().from(players).where(inArray(players.playerName, playerNames));

	const existingNames = existing.map((p) => p.playerName);
	const newNames = playerNames.filter((n) => !existingNames.includes(n));

	// Step 2: Insert only new players
	if (newNames.length > 0) {
		await db
			.insert(players)
			.values(newNames.map((n) => ({ playerName: n })))
			.onConflictDoNothing();
	}

	// Step 3: Return all player records (fresh + existing)
	const allPlayers = await db
		.select()
		.from(players)
		.where(inArray(players.playerName, playerNames));

	return allPlayers;
}

export async function addGameResults(
	gameId: number,
	results: { playerName: string; profitLoss: number }[]
) {
	// Ensure players exist
	const allPlayers = await addPlayersIfNotExist(results.map((r) => r.playerName));

	// Map playerName → playerId
	const playerMap = new Map(allPlayers.map((p) => [p.playerName, p.id]));

	// Build insert records
	const insertRows = results.map((r) => ({
		gameId,
		playerId: playerMap.get(r.playerName)!,
		profitLoss: r.profitLoss
	}));

	await db.insert(gameResults).values(insertRows);

	return { gameId, inserted: insertRows.length };
}
