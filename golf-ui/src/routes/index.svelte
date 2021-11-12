<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Round } from 'src/types.svelte';

	// TODO - GET rounds from DB

	let previousRounds: Round[] = [
		{
			id: 0,
			date: '01/01/2020',
			name: 'PGA National',
			holes: [
				{
					id: 0,
					par: 5,
					strokes: 5,
					yardage: 500,
					handicap: 1,
					notes: 'Nice par!',
					holeNumber: 1
				}
			]
		}
	];
</script>

<h1>Welcome to NoahGolf</h1>
<button on:click={async () => await goto("/new")}>Begin a new round</button>

{#each previousRounds as { name: course, date, holes, id }}
	<div class="home-score" on:click={async () => await goto(`/round?id=${id}`)}>
		{holes.reduce((score, hole) => (score += hole.strokes), 0)}
		at {course} on {date}
	</div>
{/each}

<style>
	.home-score {
		padding: 10px;
		margin-top: 10px;
		border: 1px solid black;
		cursor: pointer;
		max-width: 300px;
	}
</style>
