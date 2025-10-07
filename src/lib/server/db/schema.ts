import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age')
});

export const game = sqliteTable('game', {
	id: integer('id').primaryKey(),
	highScore: integer('high_score')
});
