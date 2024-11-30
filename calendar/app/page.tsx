'use client';
import CalendarComponent from './components/Calendar';

export default function Home() {
	return (
		<main className='p-4'>
			<h1 className='text-2xl font-bold mb-4'>Calendar App</h1>
			<CalendarComponent />
		</main>
	);
}
