<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Course } from 'src/types.svelte';

	const range = (num: number): number[] => Array.from(Array(18).keys());

	const hole_info = range(18).map((num) => ({
		par: null,
		handicap: null,
		yardage: null,
		holeNumber: num + 1
	}));

	let new_course: Course = {
		id: -1,
		name: '',
		holes: hole_info
	};

	let courses: Course[] = [];

	let selectedId = 1000;

	let date = new Date().toISOString();

	fetch('http://localhost:5000/get_courses', {
		method: 'GET'
	})
		.then((res) => res.json())
		.then((data: Course[]) => {
			courses = data;
			if (data.length > 0) {
				selectedId = data[0].id;
			}
		});

	const addCourse = async () => {
		const validHoles = new_course.holes.filter((hole) => hole.par !== null).length;
		if (!validHoles) return;

		if (!window.confirm('Are you sure you want to add this course?')) return;

		await fetch('http://localhost:5000/new_course', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(new_course)
		})
			.then((res) => res.json())
			.then((data) => {
				const added_course = {
					...new_course,
					id: data.id
				};
				courses = [...courses, added_course];
				selectedId = data.id;
			});
	};

	const newRound = async () => {
		const course = courses.find((i) => i.id === selectedId);
		if (!course) return;

		await fetch('http://localhost:5000/new_round', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: course.name,
				date: date,
				holes: course.holes
			})
		})
			.then((res) => res.json())
			.then(async (data) => {
				await goto(`/round?id=${data.id}`);
			});
	};
</script>

<!-- Select the date of the round -->
<p>Required: Choose the date of the round of golf</p>
<input type="date" bind:value={date} />

<hr />

<!-- Fetch list of current courses -->
<p>Select from a list of previous courses</p>
<select bind:value={selectedId}>
	{#each courses as course}
		<option value={course.id} selected={course.id === selectedId}>{course.name}</option>
	{/each}
</select>

<!-- Create a new Round on the DB, return the ID, and navigate to round page -->
<button on:click={newRound}>Play with selected course!</button>

<hr />

<!-- Input a new course -->
<p>Input the scorecard of a new course if not in above list</p>
<input placeholder="Course Name" bind:value={new_course.name} id="course-name-input" />

{#each range(18) as hole}
	<div class="hole-container">
		<input placeholder={`${hole + 1} par`} type="text" disabled value={hole + 1} />
		<input
			placeholder={`${hole + 1} par`}
			bind:value={new_course.holes[hole].par}
			type="number"
			min={3}
			max={5}
		/>
		<input
			placeholder={`${hole + 1} handicap`}
			bind:value={new_course.holes[hole].handicap}
			min={1}
			max={18}
			type="number"
		/>
		<input
			placeholder={`${hole + 1} yardage`}
			bind:value={new_course.holes[hole].yardage}
			min={1}
			max={18}
			type="number"
		/>
	</div>
{/each}

<!-- Create a new Round on the DB, return the ID, and navigate to round page -->
<button on:click={addCourse} id="submit-button">Create new course!</button>

<style>
	.hole-container input {
		width: 80px;
		height: 20px;
		margin: 5px;
	}

	#course-name-input {
		width: 150px;
		height: 20px;
		margin: 5px;
	}

	#submit-button {
		margin: 10px 5px 40px 5px;
		height: 40px;
	}
</style>
