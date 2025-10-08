import * as z from 'zod';

export const addGameFormSchema = z.object({
	gameName: z.string().min(2).max(50)
});

export type AddGameFormSchema = typeof addGameFormSchema;
