<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { addGameFormSchema, type AddGameFormSchema } from './schema';
	import Game from '$lib/components/Game.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';

	let {
		data
	}: { data: { form: SuperValidated<Infer<AddGameFormSchema>>; gamesWithPlayers: any[] } } =
		$props();

	const gamesWithPlayers = data.gamesWithPlayers;

	const form = superForm(data.form, {
		validators: zodClient(addGameFormSchema)
	});

	const { form: formData, enhance } = form;
</script>

<header>
	<h1 class="my-8 text-center text-4xl font-bold">Teen Patti Settler</h1>
</header>

<main>
	<div class="container mx-auto px-4">
		<form method="POST" use:enhance class="mb-8">
			<Form.Field {form} name="gameName">
				<div class="flex gap-2">
					<Form.Control>
						{#snippet children({ props })}
							<!-- <Form.Label>Game Name</Form.Label> -->
							<Input {...props} bind:value={$formData.gameName} />
						{/snippet}
					</Form.Control>
					<Form.Button>Add Game</Form.Button>
				</div>
				<Form.FieldErrors />
			</Form.Field>
		</form>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each gamesWithPlayers as game}
				<Game {game} />
			{/each}
		</div>
	</div>
</main>
