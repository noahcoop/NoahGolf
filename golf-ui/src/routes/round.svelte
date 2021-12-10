<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import type { Round, Hole } from 'src/types.svelte';
	const roundID = $page.query.get('id');

	const getScore = (holes: Hole[]) => {
		const totalScore = holes.reduce((score, hole) => (score += hole.strokes), 0);
		const overUnderPar = holes.reduce(
			(score, hole) => (score += hole.strokes - (hole.strokes ? hole.par : 0)),
			0
		);
		const overUnderParString =
			overUnderPar === 0 ? 'E' : overUnderPar > 0 ? `+${overUnderPar}` : `${overUnderPar}`;
		const totalHolesPlayed = holes.filter((hole) => hole.strokes > 0).length;

		return {
			totalScore,
			overUnderParString,
			totalHolesPlayed
		};
	};

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
			round = {
				...data,
				holes: data.holes
					.sort((a, b) => a.holeNumber - b.holeNumber)
					.filter((hole) => hole.par !== null)
			};
		});

	const updateRound = async () => {
		await fetch('http://localhost:5000/update_round_scores', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(round)
		}).catch(() => alert('Error updating score for this round'));
	};
</script>

<button on:click={async () => await goto('/')}>Return Home</button>

<h1>{round.name}</h1>
<h3>{new Date(round.date).toUTCString().slice(5, 16)}</h3>
<h3>Score: {getScore(round.holes).totalScore}</h3>
<h3>{getScore(round.holes).overUnderParString} thru {getScore(round.holes).totalHolesPlayed}</h3>

<!-- Score and Notes inputs with associated update functions on blur -->

{#each round.holes as hole, index}
	<div class="hole-container">
		<div class="hole-number">{hole.holeNumber}</div>
		<b>Par {hole.par}, {hole.yardage} Yards, #{hole.handicap} Handicap</b>

		<div>
			Score: <input
				class="hole-strokes"
				type="number"
				bind:value={round.holes[index].strokes}
				on:blur={updateRound}
			/>
		</div>
		<textarea
			placeholder="Notes:"
			class="hole-notes"
			bind:value={round.holes[index].notes}
			on:blur={updateRound}
		/>
	</div>
{/each}

<style>
	.hole-container {
		padding: 10px;
		margin: 20px;
		border: 1px solid black;
		cursor: pointer;
		width: 300px;
		display: inline-block;
	}

	.hole-number {
		padding: 5px;
		margin-bottom: 10px;
		width: 20px;
		border: 1px solid black;
		border-radius: 16px;
		text-align: center;
	}

	.hole-strokes {
		height: 30px;
		margin-top: 10px;
	}

	.hole-notes {
		height: 60px;
		margin-top: 10px;
		width: 100%;
	}
</style>
