<script lang="ts">
	import { isToday, isSunday, previousSunday, format, eachDayOfInterval, addDays, isFirstDayOfMonth } from "date-fns";

	function getDatesInRange(startDate: number, endDate: number) {
		return eachDayOfInterval({
			start: new Date(startDate),
			end: new Date(endDate)
		})
	}
	
	let now = new Date("2023-01-07")
	let startDate = now;
	if(!isSunday(now)){
		startDate = previousSunday(now)
	}

	let dateRangeCount = 40;
	let endDate = addDays(startDate, dateRangeCount);

	let selectedDates: {[key: number]: boolean} = {}
	let lastSelectedDate: number;

	const selectedDateClicked = (date: number, e: MouseEvent) => {
		
		if(selectedDates[date]){
			delete selectedDates[date]
			lastSelectedDate = undefined;
		} else {
			if(!e.shiftKey){
				lastSelectedDate = date;
			}
			selectedDates[date] = true
		}

		if (e.shiftKey && lastSelectedDate && lastSelectedDate !== date){
			const datesBetween = getDatesInRange(lastSelectedDate, date);
			datesBetween.forEach(date => {
				selectedDates[`${date.getTime()}`] = true;
			})
		};

		selectedDates = {...selectedDates}
		console.log('selectedDates:', selectedDates);
	}

	type CalendarDate = {
		date: Date,
		dayOfWeek: number;
		isSelected: boolean;
	}

	const datesList = getDatesInRange(startDate.getTime(), endDate.getTime());
	
	const months: {month: string, startingDayOfWeek: number, dates: Date[]}[] = [];
	// get an array of arrays, each array is a month
	datesList.forEach((date, idx) => {
		const monthNumber = date.getMonth();
		if(monthNumber === datesList[idx-1]?.getMonth()){
			months[monthNumber].dates.push(date)
		} else {
			months.push({month: format(date, 'LLLL'), startingDayOfWeek: date.getDay(), dates: [date]})
		}
	})

	const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
</script>

<div>
	<div class="days-of-week">
		{#each daysOfWeek as day}
			<div>{day}</div>
		{/each}
	</div>
	{#each months as month}
		<div class="month">
			{month.month}
		</div>
		<div class="month-dates">
			{#each Array(month.startingDayOfWeek) as day}
				<button class="date"></button>
			{/each}
			{#each month.dates as date}
				<button
				class:today={isToday(date)}
				class:selected={selectedDates[date.getTime()] === true}
				class='date selectable'
				on:click={(e) => selectedDateClicked(date.getTime(), e)}
				>
				{date.getDate()}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.days-of-week {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		align-items: center;
		justify-content: center;
		justify-items: center;
		padding-bottom: 1rem;
	}
	button {
		background-color: transparent;
		padding: 0;
		border: none;
	}
	.month {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.month-dates {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
	}
	.date {
		width: 3rem;
		height: 3rem;
		border-radius: .25rem;
		margin: .25rem;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2px solid transparent;
		box-sizing: border-box;
	}
	.selectable:hover{
		cursor: pointer;
		border: 2px solid lightgray;
	}
	.selected {
		background-color: lightskyblue;
	}

	.today, .today:hover {
		border-color: blue;
	}
</style>
