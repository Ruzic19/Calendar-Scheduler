import { useState, useEffect } from "react";

const Calendar = () => {

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
        "January",
        "February",
        "March","April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December" ];

    const currentDate = new Date()

    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventsTime, setEventTime] = useState({hours: '00', minutes: '00'});
    const [eventText, setEventText] = useState('');
    const [eventClient, setEventClient] = useState('');
    const [eventNumber, setEventNumber] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [flexDirection, setFlexDirection] = useState("row");

 
    const toggleOpen = () => {
        setIsOpen(!isOpen);
        setFlexDirection((prevDirection) => (prevDirection === "row" ? "column" : "row"));
    }

    // this holds the current day of month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // this holds the first day of the current month

    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth -1));
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear-1 : prevYear));
    }

    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    }

    const handleDayClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        const today = new Date()

        if(clickedDate >= today || isSameDate(clickedDate,today)) {
            setSelectedDate(clickedDate);
            setShowEventPopup(true);
            setEventTime({hours: '00', minutes: '00'});
            setEventText('');
            setEventClient('');
            setEventNumber('');
            setEditingEvent(null);
        }

    }

    const isSameDate = (date1,date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate() 
        )
    }
  
    const handleEventSubmit = () => {
        const newEvent = {
            id: editingEvent ? editingEvent.id : Date.now(),
            date: selectedDate,
            time: `${eventsTime.hours.padStart(2, '0')}:${eventsTime.minutes.padStart(2, '0')}`,
            text: eventText,
            client: eventClient,
            number: eventNumber,
        }

        let updatedEvents = [...events]

        if(editingEvent) {
            updatedEvents = updatedEvents.map((event) => event.id === editingEvent.id ? newEvent : event,
        )
        } else {
            updatedEvents.push(newEvent);
        }

        updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date))

        setEvents(updatedEvents);
        setEventTime({hours: '00', minutes: '00'})
        setEventText('');
        setEventClient('');
        setEventNumber('');
        setEditingEvent(null);
        setShowEventPopup(false);
    }

    const handleEditEvent = (event) => {
        setSelectedDate(new Date(event.date));
        setEventTime({
            hours: event.time.split(":")[0],
            minutes: event.time.split(":")[1],
        });
        setEventText(event.text);
        setEventClient(event.client);
        setEventNumber(event.number);
        setEditingEvent(event);
        setShowEventPopup(true);

    }

    const handleDeleteEvent = (eventId) => {
        const updatedEvents = events.filter((event) => event.id !== eventId)
        setEvents(updatedEvents)
    }

    const handleTimeChange = (e) => {
        const {name, value} = e.target;

        setEventTime((prevTime) => ({...prevTime, [name]: value.padStart(2,"0")}) )
    }
 



  return (
    <div className='calendar-app'>

        <div className='calendar'>

            <h1 className="heading">Calendar</h1>

            <div className="navigate-date">
                <h2 className="month">{monthsOfYear[currentMonth]}</h2>
                <h2 className="year">{currentYear}</h2>
                <div className="buttons">
                    <i className="bx bx-chevron-left" onClick={prevMonth}></i>
                    <i className="bx bx-chevron-right" onClick={nextMonth}></i>
                </div>
            </div>

            <div className="weekdays">
                {daysOfWeek.map((day) => <span key={day}>{day}</span>)}
            </div>

            <div className="days">
                {[...Array(firstDayOfMonth).keys()].map((_, index) => <span key={`empty-${index}`}></span>)}

                {[...Array(daysInMonth).keys()].map((day) => <span key={day+1} className={ day + 1 === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() ? 'current-day' : ' '} onClick={ () => handleDayClick(day + 1)}>{day+1}</span>)} 
                {/* objasniti liniju koda gore */}
            </div>

        </div>

        <div className="events">
            {showEventPopup && (
                <div className="event-popup">

                    <div className="time-input">
                        <div className="event-popup-time">Time</div>
                        <input type="number" name='hours' min={0} max={24} className='hours' value={eventsTime.hours} 
                        onChange={handleTimeChange}/>
                        <input type="number" name='minutes'  min={0} max={60} className='minutes' value={eventsTime.minutes} onChange={handleTimeChange}/>
                    </div>

                     <div className="name-input">
                        <div className="event-popup-name"> Client </div>
                        <input type="text" name='client-name' placeholder="Ime Prezime" className="client-name" value={eventClient} onChange={(e) => {
                            if (e.target.value !== '') {
                                setEventClient(e.target.value);
                            } 
                        }} />
                    </div> 

                     <div className="number-input">
                        <div className="event-popup-tel"> Tel: </div>
                        <input type="tel" id="phone" name="phone" placeholder=" +385 / 0" pattern="^(\+385|0)\d{9,}$" value={eventNumber} onChange={(e) => {
                            if (e.target.value !== '') {
                                setEventNumber(e.target.value);
                            }
                        }} />
                    </div> 

                    <textarea placeholder='Tel:  Email:' name="" id="" value={eventText} onChange={(e) => {
                        if (e.target.value.length <= 500) {
                            setEventText(e.target.value)
                        }
                    }}></textarea>

                    <div className="file-input">

                    </div>



                    <button className="event-popup-btn" onClick={handleEventSubmit}>{editingEvent ? "Update Event" : "Add Event"}</button>

                    <button className="close-event-popup" onClick={() => setShowEventPopup(false)}>
                        <i className="bx bx-x"></i>
                    </button>

                </div>)
            }

            {events.filter((event) => event.date.getMonth() === currentMonth && event.date.getFullYear() === currentYear).map((event, index) =>  
            
            (
                <div className={`event ${isOpen ? 'event-open' : ''}` }key={index} onClick={toggleOpen} style={{flexDirection : flexDirection, gap : "1rem", width: "100%" , justifyItems: "center", alignItems: "flex-start"}}>
                
                    <div className="event-date-wrapper">
                        <div className="event-date">{`${monthsOfYear[event.date.getMonth()]} ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
                        <div className="event-time">{event.time}</div>
                        <div className="event-number">{event.number}</div>
                    </div>
                
                    <div className="event-text">
                        <div>
                            <h3>{event.client}</h3>
                        </div>
                        {event.text}
                    </div>

                    <div className="event-buttons">
                        <i className="bx bx-edit" onClick={() =>(handleEditEvent(event))}></i>
                        <i className="bx bxs-message-square-x" onClick={() => handleDeleteEvent(event.id)}></i>
                    </div>
                
                </div>
            )
            )}

        </div>

    </div>
  )
}

export default Calendar

