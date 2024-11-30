import React, { useState } from 'react';

interface Event {
	id: number;
	title: string;
	date: string; // Format: YYYY-MM-DD
	time?: string;
	description?: string;
}

const getDaysInMonth = (year: number, month: number) => {
	const days = [];
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const totalDays = new Date(year, month + 1, 0).getDate();

	// Add padding for previous month
	for (let i = 0; i < firstDayOfMonth; i++) {
		days.push(null);
	}

	// Add days of the current month
	for (let day = 1; day <= totalDays; day++) {
		days.push(day);
	}

	return days;
};

const getWeekDays = (currentDate: Date) => {
	const weekDays = [];
	const currentDayIndex = currentDate.getDay();
	const startOfWeek = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate() - currentDayIndex
	);

	for (let i = 0; i < 7; i++) {
		const day = new Date(startOfWeek);
		day.setDate(startOfWeek.getDate() + i);
		weekDays.push(day);
	}

	return weekDays;
};

const Calendar = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState<Event[]>([]);
	const [view, setView] = useState<'month' | 'week' | 'day'>('month');
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [formInput, setFormInput] = useState<Partial<Event>>({});
	const [modalData, setModalData] = useState<Event | null>(null);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const dateString = currentDate.toISOString().split('T')[0];

	const daysInMonth = getDaysInMonth(year, month);
	const weekDays = getWeekDays(currentDate);

	// Navigation handlers
	const prevHandler = () => {
		if (view === 'month') {
			setCurrentDate(new Date(year, month - 1, 1));
		} else if (view === 'week') {
			setCurrentDate(
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate() - 7
				)
			);
		} else {
			setCurrentDate(
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate() - 1
				)
			);
		}
	};

	const nextHandler = () => {
		if (view === 'month') {
			setCurrentDate(new Date(year, month + 1, 1));
		} else if (view === 'week') {
			setCurrentDate(
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate() + 7
				)
			);
		} else {
			setCurrentDate(
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate() + 1
				)
			);
		}
	};

	const jumpToToday = () => {
		const today = new Date();

		if (view === 'month') {
			setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
		} else if (view === 'week') {
			setCurrentDate(today);
		} else {
			setSelectedDate(today.toISOString().split('T')[0]);
			setCurrentDate(today);
		}
	};

	const getEventsForDate = (date: string) => {
		return events.filter((event) => event.date === date);
	};

	// Add Event
	const addEvent = () => {
		if (formInput.title && selectedDate) {
			setEvents([
				...events,
				{
					id: events.length + 1,
					title: formInput.title,
					date: selectedDate,
					time: formInput.time,
					description: formInput.description
				}
			]);
			setFormInput({});
			setSelectedDate(null);
		}
	};

	return (
		<div className='max-w-4xl mx-auto p-4 bg-gray-900 text-gray-100 rounded shadow-lg'>
			{/* Header */}
			<div className='flex justify-between items-center mb-4'>
				<div className='flex space-x-2'>
					<button
						className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
						onClick={prevHandler}
					>
						&lt; Prev
					</button>
					<button
						className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
						onClick={jumpToToday}
					>
						Today
					</button>
					<button
						className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
						onClick={nextHandler}
					>
						Next &gt;
					</button>
				</div>
				<h2 className='text-2xl font-bold'>
					{view === 'month'
						? `${currentDate.toLocaleString('default', {
								month: 'long'
						  })} ${year}`
						: view === 'week'
						? `Week of ${weekDays[0].toLocaleDateString()}`
						: currentDate.toDateString()}
				</h2>
			</div>

			{/* View Selector */}
			<div className='flex justify-center mb-6 space-x-4'>
				<button
					className={`px-4 py-2 rounded ${
						view === 'month'
							? 'bg-green-600 text-white'
							: 'bg-gray-700 text-gray-300'
					}`}
					onClick={() => setView('month')}
				>
					Month View
				</button>
				<button
					className={`px-4 py-2 rounded ${
						view === 'week'
							? 'bg-green-600 text-white'
							: 'bg-gray-700 text-gray-300'
					}`}
					onClick={() => setView('week')}
				>
					Week View
				</button>
				<button
					className={`px-4 py-2 rounded ${
						view === 'day'
							? 'bg-green-600 text-white'
							: 'bg-gray-700 text-gray-300'
					}`}
					onClick={() => setView('day')}
				>
					Day View
				</button>
			</div>

			{/* Monthly View */}
			{view === 'month' && (
				<div className='grid grid-cols-7 gap-1'>
					{daysInMonth.map((day, index) => {
						const dayString = day ? `${year}-${month + 1}-${day}` : null;
						return (
							<div
								key={index}
								className={`p-2 border rounded ${
									day
										? 'bg-gray-800 hover:bg-gray-700 cursor-pointer'
										: 'bg-transparent'
								}`}
								onClick={() => day && setSelectedDate(dayString!)}
							>
								<div className='text-lg font-bold text-gray-100'>{day}</div>
								{dayString &&
									getEventsForDate(dayString).map((event) => (
										<div
											key={event.id}
											className='bg-green-500 text-white text-xs rounded px-1 py-0.5'
											onClick={(e) => {
												e.stopPropagation();
												setModalData(event);
											}}
										>
											{event.title}
										</div>
									))}
							</div>
						);
					})}
				</div>
			)}

			{/* Weekly View */}
			{view === 'week' && (
				<div className='grid grid-cols-7 gap-1'>
					{weekDays.map((date, index) => {
						const dayString = date.toISOString().split('T')[0];
						return (
							<div
								key={index}
								className='p-2 border rounded bg-gray-800'
								onClick={() => setSelectedDate(dayString)}
							>
								<div className='text-lg font-bold text-gray-100'>
									{date.toLocaleDateString()}
								</div>
								{getEventsForDate(dayString).map((event) => (
									<div
										key={event.id}
										className='bg-green-500 text-white text-xs rounded px-1 py-0.5'
										onClick={(e) => {
											e.stopPropagation();
											setModalData(event);
										}}
									>
										{event.title}
									</div>
								))}
							</div>
						);
					})}
				</div>
			)}

			{/* Daily View */}
			{view === 'day' && (
				<div className='p-4 border rounded bg-gray-800'>
					<h3 className='text-xl font-bold text-green-400 mb-4'>
						{dateString}
					</h3>
					{getEventsForDate(dateString).map((event) => (
						<div
							key={event.id}
							className='bg-green-500 text-white rounded p-2 mb-2'
							onClick={() => setModalData(event)}
						>
							<h4 className='font-bold'>{event.title}</h4>
							<p>{event.time || 'All Day'}</p>
							<p>{event.description || 'No description provided.'}</p>
						</div>
					))}
					{getEventsForDate(dateString).length === 0 && (
						<p className='text-gray-300'>No events for this day.</p>
					)}
				</div>
			)}

			{/* Add Event Modal */}
			{selectedDate && !modalData && (
				<div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center'>
					<div className='bg-gray-900 p-6 rounded shadow-md w-1/3'>
						<h3 className='text-lg font-bold mb-4 text-green-400'>
							Add Event for {selectedDate}
						</h3>
						<input
							type='text'
							placeholder='Event Title'
							value={formInput.title || ''}
							className='w-full p-2 border rounded mb-4 bg-gray-700 text-gray-100'
							onChange={(e) =>
								setFormInput((prev) => ({ ...prev, title: e.target.value }))
							}
						/>
						<input
							type='time'
							value={formInput.time || ''}
							className='w-full p-2 border rounded mb-4 bg-gray-700 text-gray-100'
							onChange={(e) =>
								setFormInput((prev) => ({ ...prev, time: e.target.value }))
							}
						/>
						<textarea
							placeholder='Event Description'
							value={formInput.description || ''}
							className='w-full p-2 border rounded mb-4 bg-gray-700 text-gray-100'
							onChange={(e) =>
								setFormInput((prev) => ({
									...prev,
									description: e.target.value
								}))
							}
						/>
						<div className='flex justify-between'>
							<button
								className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
								onClick={addEvent}
							>
								Add Event
							</button>
							<button
								className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
								onClick={() => setSelectedDate(null)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Event Details Modal */}
			{modalData && (
				<div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center'>
					<div className='bg-gray-900 p-6 rounded shadow-md w-1/3'>
						<h3 className='text-lg font-bold mb-4 text-green-400'>
							Event Details
						</h3>
						<p>
							<strong>Title:</strong> {modalData.title}
						</p>
						<p>
							<strong>Date:</strong> {modalData.date}
						</p>
						<p>
							<strong>Time:</strong> {modalData.time || 'All Day'}
						</p>
						<p>
							<strong>Description:</strong>{' '}
							{modalData.description || 'No Description'}
						</p>
						<div className='flex justify-between mt-4'>
							<button
								className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
								onClick={() => {
									setEvents(
										events.filter((event) => event.id !== modalData.id)
									);
									setModalData(null);
								}}
							>
								Delete
							</button>
							<button
								className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
								onClick={() => setModalData(null)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Calendar;
