import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Table 1: Games
export const games = sqliteTable('games', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	gameName: text('game_name').notNull(),
	gameDate: text('game_date').default('CURRENT_TIMESTAMP').notNull(),
	notes: text('notes')
});

// Table 2: Players
export const players = sqliteTable('players', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	playerName: text('player_name').notNull().unique()
});

// Table 3: Game Results (linking table)
export const gameResults = sqliteTable('game_results', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	gameId: integer('game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	playerId: integer('player_id')
		.notNull()
		.references(() => players.id, { onDelete: 'cascade' }),
	profitLoss: real('profit_loss').notNull().default(0)
});
