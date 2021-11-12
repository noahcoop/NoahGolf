<script lang="ts">
	import { page } from '$app/stores';
	import type { Round } from 'src/types.svelte';
	const roundID = $page.query.get('id');

	let round: Round = {
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
			},
			{
				id: 1,
				par: 4,
				strokes: 5,
				yardage: 380,
				handicap: 2,
				notes: 'Duffed bunker shot',
				holeNumber: 2
			},
			{
				id: 2,
				par: 3,
				strokes: 3,
				yardage: 175,
				handicap: 3,
				notes: '',
				holeNumber: 3
			}
		]
	};

	fetch(`http://localhost:5000/get_round/${roundID}`, {
		method: 'GET'
	})
		.then((res) => res.json())
		.then((data: Round) => {
			round = data
		});
</script>

<h1>{round.name}</h1>
<h3>{round.date}</h3>

<!-- Score and Notes inputs with associated update functions on blur -->

{#each round.holes as hole}
	<div class="hole-container">
		<div class="hole-par">Par {hole.par}</div>
		<div class="hole-strokes">Score: {hole.strokes}</div>
		<div class="hole-handicap">Handicap #{hole.handicap}</div>
		<div class="hole-yardage">{hole.yardage} Yards</div>
		<div class="hole-notes">Notes: {hole.notes}</div>
	</div>
{/each}

<style>
	.hole-container {
		padding: 10px;
		margin-top: 10px;
		border: 1px solid black;
		cursor: pointer;
		max-width: 300px;
	}
</style>
