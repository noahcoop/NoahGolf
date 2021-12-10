<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Hole, Round } from 'src/types.svelte';

	const getScore = (holes: Hole[]) => {
		return holes.reduce((score, hole) => (score += hole.strokes), 0);
	};

	let previousRounds: Round[] = [];
	let analytics = {
		birdiePercentage: null,
		parPercentage: null,
		bogeyPercentage: null,
		totalHolesRecorded: null,
		otherPercentage: null
	};

	const getAnalytics = (rounds: Round[]) => {
		const totalHolesRecorded = rounds.reduce(
			(total, round) => (total += round.holes.filter((hole) => hole.strokes).length),
			0
		);
		const totalBirdies = rounds.reduce(
			(total, round) =>
				(total += round.holes.filter((hole) => hole.par - hole.strokes === 1).length),
			0
		);
		const totalPars = rounds.reduce(
			(total, round) =>
				(total += round.holes.filter(
					(hole) => hole.par - hole.strokes === 0 && hole.strokes !== null
				).length),
			0
		);
		const totalBogeys = rounds.reduce(
			(total, round) =>
				(total += round.holes.filter((hole) => hole.par - hole.strokes === -1).length),
			0
		);

		const birdiePercentage = Number(((100 * totalBirdies) / totalHolesRecorded).toFixed(2));
		const parPercentage = Number(((100 * totalPars) / totalHolesRecorded).toFixed(2));
		const bogeyPercentage = Number(((100 * totalBogeys) / totalHolesRecorded).toFixed(2));
		const otherPercentage = Number(
			(100 - birdiePercentage - parPercentage - bogeyPercentage).toFixed(2)
		);

		return {
			totalHolesRecorded,
			birdiePercentage,
			parPercentage,
			bogeyPercentage,
			otherPercentage
		};
	};

	fetch('http://localhost:5000/get_rounds', {
		method: 'GET'
	})
		.then((res) => res.json())
		.then((data: Round[]) => {
			previousRounds = data;
			analytics = getAnalytics(data);
		});
</script>

<div style="display:flex; justify-content: space-evenly">
	<div>
		<h1>Welcome to NoahGolf</h1>
		<button on:click={async () => await goto('/new')} id="begin-round-button"
			>Begin a new round</button
		>

		<br />
		<b>My Previous Rounds:</b>
		{#each previousRounds as { name: course, date, holes, id }}
			<div class="home-score" on:click={async () => await goto(`/round?id=${id}`)}>
				{getScore(holes)}
				at {course} on {new Date(date).toUTCString().slice(5, 16)}
			</div>
		{/each}
	</div>
	<img src="https://media.giphy.com/media/EktxJpVkq9VcCu5YjT/giphy-downsized-large.gif" id="gif" />
</div>

<hr />
<div style="text-align:center">
	<b>Analytics</b>

	<div>Total Holes Played: {analytics.totalHolesRecorded}</div>
	<div>Birdies: {analytics.birdiePercentage}%</div>
	<div>Pars: {analytics.parPercentage}%</div>
	<div>Bogeys: {analytics.bogeyPercentage}%</div>
	<div>Other: {analytics.otherPercentage}%</div>
</div>

<style>
	.home-score {
		padding: 10px;
		margin-top: 10px;
		border: 1px solid black;
		cursor: pointer;
		width: 300px;
	}

	#begin-round-button {
		height: 40px;
		margin-bottom: 10px;
	}

	#gif {
		height: min-content;
	}
</style>
