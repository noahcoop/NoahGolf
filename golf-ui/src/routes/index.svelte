<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Hole, Round } from 'src/types.svelte';

	const getScore = (holes: Hole[]) => {
		return holes.reduce((score, hole) => (score += hole.strokes), 0);
	};

	let previousRounds: Round[] = [];

	fetch('http://localhost:5000/get_rounds', {
		method: 'GET'
	})
		.then((res) => res.json())
		.then((data: Round[]) => {
			previousRounds = data;
			console.log(previousRounds);
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
	<img src="https://media.giphy.com/media/EktxJpVkq9VcCu5YjT/giphy-downsized-large.gif" />
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
</style>
