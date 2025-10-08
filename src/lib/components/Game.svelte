<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Table from '$lib/components/ui/table/index';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	const { game } = $props();
</script>

<Card.Root class="border border-gray-200 shadow-sm">
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title class="text-lg font-semibold">{game.gameName}</Card.Title>
			<span class="text-sm text-muted-foreground">
				{game.gameDate}
			</span>
		</div>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Player</Table.Head>
					<Table.Head class="text-right">Profit/Loss</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each game.results as result}
					<Table.Row>
						<Table.Cell>{result.playerName}</Table.Cell>
						<Table.Cell class="text-right">
							{#if result.profitLoss >= 0}
								<Badge class="bg-green-100 font-medium text-green-800">+₹{result.profitLoss}</Badge>
							{:else}
								<Badge class="bg-red-100 font-medium text-red-800">₹{result.profitLoss}</Badge>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
	<Card.Footer class="flex justify-end">
		<Button>Edit</Button>
	</Card.Footer>
</Card.Root>
