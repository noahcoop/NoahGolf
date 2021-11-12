<script lang="ts" context="module">
	export type Round = {
		id: number;
		date: string;
		name: string;
		holes: Hole[];
	};

	export type Hole = {
		id: number;
		par: number;
		holeNumber: number;
		strokes: number;
		yardage: number;
		handicap: number;
		notes: string;
	};

	export type Course = {
		id: number;
		name: string;
		holes: {
			par: number;
			yardage: number;
			handicap: number;
			holeNumber: number;
		}[];
	}
</script>
