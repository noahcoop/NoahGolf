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

	let courses: Course[] = [
		{
			id: 1000,
			name: 'Test Course',
			holes: hole_info
		}
	];

	let selectedId = 1000

	
	fetch('http://localhost:5000/get_courses', {
		method: 'GET'
	}).then((res) => res.json())
	.then((data: Course[]) => {
		courses = data
		if (data.length > 0) {
			selectedId = data[0].id
		}
	})
	

	const addCourse = async () => {
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
				selectedId = data.id
			});
	};

	const newRound = async () => {
		const course = courses.find((i) => i.id === selectedId)
		if (!course) return

		await fetch('http://localhost:5000/new_round', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: course.name,
				date: new Date().toISOString(),
				holes: course.holes
			})
		})
			.then((res) => res.json())
			.then(async (data) => {
				await goto(`/round?id=${data.id}`);
			});
	}

</script>

<!-- Fetch list of current courses -->
<p>Select from a list of previous courses</p>
<select bind:value={selectedId}>
	{#each courses as course}
		<option value={course.id} selected={course.id === selectedId}>{course.name}</option>
	{/each}
</select>

<!-- Create a new Round on the DB, return the ID, and navigate to round page -->
<button on:click={newRound}
	>Play with selected course!</button
>

<hr />

<!-- Input a new course -->
<p>Input the scorecard of a new course</p>
<input placeholder="Course Name" bind:value={new_course.name} />
<!-- TODO - date input that defaults to today -->

{#each range(18) as hole}
	<div class="hole-container">
		<input placeholder={`${hole + 1} par`} bind:value={new_course.holes[hole].par} type="number" />
		<input
			placeholder={`${hole + 1} handicap`}
			bind:value={new_course.holes[hole].handicap}
			type="number"
		/>
		<input
			placeholder={`${hole + 1} yardage`}
			bind:value={new_course.holes[hole].yardage}
			type="number"
		/>
	</div>
{/each}

<!-- Create a new Round on the DB, return the ID, and navigate to round page -->
<button on:click={addCourse}>Create new course!</button>
