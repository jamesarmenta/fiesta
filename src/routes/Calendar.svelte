<script lang="ts">
	import { isToday, format, eachDayOfInterval, endOfMonth } from "date-fns";
	import { selectedDatesMap } from '$lib/stores/createEvent';

	const isBeforeDayOf = (date1: Date, date2: Date) => {
		const day1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
		const day2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();
		return day1 < day2;
	}
	
	const startOfThisMonth = (date: Date) => {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	const startOfPreviousMonth = (date: Date) => {
		if(date.getMonth() === 0){
			return new Date(date.getFullYear() - 1, 11, 1);
		} else {
			return new Date(date.getFullYear(), date.getMonth() - 1, 1);
		}
	}

	const startOfNextMonth = (date: Date) => {
		if(date.getMonth() === 11){
			return new Date(date.getFullYear() + 1, 0, 1);
		} else {
			return new Date(date.getFullYear(), date.getMonth() + 1, 1);
		}
	}

	const now = new Date();
	let startDate = startOfThisMonth(now);
	$: endDate = endOfMonth(startDate);
	
	let lastSelectedDate: number | undefined;

	$: datesList = eachDayOfInterval({start: startDate.getTime(), end: endDate.getTime()});

	$: month = {
		name: format(startDate, 'LLLL'),
		startingDayOfWeek: startDate.getDay(),
		dates: datesList
	}

	// $: months =  datesList.reduce((acc, date, idx) => {
	// 	const monthNumber = date.getMonth();
	// 	if(monthNumber === datesList[idx-1]?.getMonth()){
	// 		acc[monthNumber].dates.push(date)
	// 	} else {
	// 		acc.push({month: format(date, 'LLLL'), startingDayOfWeek: date.getDay(), dates: [date]})
	// 	}
	// 	return acc
	// }, <{month: string, startingDayOfWeek: number, dates: Date[]}[]>[])
	
	
	const selectedDateClicked = (date: Date, e: MouseEvent) => {
		const selectedDateTime = date.getTime();
		selectedDatesMap.update(dates => {
			if(dates[selectedDateTime]){
				delete dates[selectedDateTime];
			} else {
				dates[selectedDateTime] = {};
			}
			return dates;
		})

		// if (e.shiftKey && lastSelectedDate && lastSelectedDate !== date){
		// 	const datesBetween = eachDayOfInterval({start: lastSelectedDate, end: date});
		// 	datesBetween.forEach(date => {
		// 		selectedDates[`${date.getTime()}`] = true;
		// 	})
		// };

		// selectedDates = {...selectedDates}
	}

	
	const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
</script>

<div>
	<div class="change-date-range">
		<button class="date-range-button" class:disable={now.getMonth() < startDate.getMonth()} on:click={() => {
			if(now.getMonth() < startDate.getMonth()){
				startDate = startOfPreviousMonth(startDate)
			}
		}}>Previous Month</button>
		<button class="date-range-button" on:click={() => {startDate = startOfNextMonth(startDate)}}>Next Month</button>
	</div>
	<div class="month">
		{month.name}
	</div>
	<div class="days-of-week">
		{#each DAYS_OF_WEEK as day}
			<div>{day}</div>
		{/each}
	</div>
	<div class="month-dates">
		{#each Array(month.startingDayOfWeek) as day}
			<button class="date"></button>
		{/each}
		{#each month.dates as date}
			<button
			class:today={isToday(date)}
			class:selected={$selectedDatesMap[date.getTime()]}
			class:selectable={!isBeforeDayOf(date, now)}
			class='date'
			on:click={(e) => !isBeforeDayOf(date, now) && selectedDateClicked(date, e)}
			>
			{date.getDate()}
			</button>
		{/each}
	</div>

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
		cursor: pointer;
	}
	.disable {
		background-color: brown;
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
		color: grey;
	}
	.selectable {
		color: black;
	}
	.selectable:hover{
		border: 2px solid lightgray;
	}
	.selected {
		background-color: lightskyblue;
	}

	.today, .today:hover {
		border-color: blue;
	}
	.change-date-range {
		display: flex;
		column-gap: 1rem;
	}
	.date-range-button {
		width: 100%;
		border-radius: .25rem;
		background-color: lightgray;
		padding: .25rem;
	}
</style>
