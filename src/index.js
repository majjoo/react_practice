import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
import './index.css';

// import App from './App';
// import reportWebVitals from './reportWebVitals';


// const CSSTransition = React.addons.CSSTransitionGroup;

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMonth: moment(),
      selectedDay: moment().startOf("day"),
      selectedMonthEvents: [],
      showEvents: false
    };

    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
    this.goToCurrentMonthView = this.goToCurrentMonthView.bind(this);

    this.initialiseEvents();
  }

  previous() {
    const currentMonthView = this.state.selectedMonth;

    this.setState({
      selectedMonth: currentMonthView.subtract(1, "month")
    });
  }

  next() {
    const currentMonthView = this.state.selectedMonth;
    this.setState({
      selectedMonth: currentMonthView.add(1, "month")
    });
  }

  select(day) {
    this.setState({
      selectedMonth: day.date,
      selectedDay: day.date.clone(),
      showEvents: true
    });
  }

  goToCurrentMonthView() {
    const currentMonthView = this.state.selectedMonth;
    this.setState({
      selectedMonth: moment()
    });
  }

  showCalendar() {
    this.setState({
      selectedMonth: this.state.selectedMonth,
      selectedDay: this.state.selectedDay,
      showEvents: false
    });
  }

  renderMonthLabel() {
    const currentMonthView = this.state.selectedMonth;
    return (
      <span className="box month-label">
        {currentMonthView.format("MMMM YYYY")}
      </span>
    );
  }

  renderDayLabel() {
    const currentSelectedDay = this.state.selectedDay;
    return (
      <span className="box month-label">
        {currentSelectedDay.format("DD MMMM YYYY")}
      </span>
    );
  }

  renderTodayLabel() {
    const currentSelectedDay = this.state.selectedDay;
    return (
      <span className="box today-label" onClick={this.goToCurrentMonthView}>
        Today
      </span>
    );
  }

  renderWeeks() {
    const currentMonthView = this.state.selectedMonth;
    const currentSelectedDay = this.state.selectedDay;
    const monthEvents = this.state.selectedMonthEvents;

    let weeks = [];
    let done = false;
    let previousCurrentNextView = currentMonthView
      .clone()
      .startOf("month")
      .subtract(1, "d")
      .day("Monday");
    let count = 0;
    let monthIndex = previousCurrentNextView.month();

    while (!done) {
      weeks.push(
        <Week
          previousCurrentNextView={previousCurrentNextView.clone()}
          currentMonthView={currentMonthView}
          monthEvents={monthEvents}
          selected={currentSelectedDay}
          select={day => this.select(day)}
        />
      );
      previousCurrentNextView.add(1, "w");
      done = count++ > 2 && monthIndex !== previousCurrentNextView.month();
      monthIndex = previousCurrentNextView.month();
    }
    return weeks;
  }

  handleAdd() {
    const monthEvents = this.state.selectedMonthEvents;
    const currentSelectedDate = this.state.selectedDay;

    let newEvents = [];

    var eventTitle = prompt(" ????????? : ");

    switch (eventTitle) {
      case "":
        alert("????????? ??????");
        break;
      case null:
        alert("?????? ?????? ?????? ??????");
        break;
      default:
        var newEvent = {
          title: eventTitle,
          date: currentSelectedDate,
          dynamic: true
        };

        newEvents.push(newEvent);

        for (var i = 0; i < newEvents.length; i++) {
          monthEvents.push(newEvents[i]);
        }

        this.setState({
          selectedMonthEvents: monthEvents
        });
        break;
    }
  }

  addEvent() {
    const currentSelectedDate = this.state.selectedDay;
    let isAfterDay = moment().startOf("day").subtract(1, "d");

    if (currentSelectedDate.isAfter(isAfterDay)) {
      this.handleAdd();
    } else {
      this.handleAdd();

    } 
  }

  removeEvent(i) {
    const monthEvents = this.state.selectedMonthEvents.slice();
    const currentSelectedDate = this.state.selectedDay;

    let index = i;

    if (index != -1) {
      monthEvents.splice(index, 1);
    } else {

    }

    this.setState({
      selectedMonthEvents: monthEvents
    });

  }

  initialiseEvents() {
    const monthEvents = this.state.selectedMonthEvents;

    let allEvents = [];


    for (var i = 0; i < allEvents.length; i++) {
      monthEvents.push(allEvents[i]);
    }

    this.setState({
      selectedMonthEvents: monthEvents
    });
  }

  render() {
    const currentMonthView = this.state.selectedMonth;
    const currentSelectedDay = this.state.selectedDay;
    const showEvents = this.state.showEvents;

    if (showEvents) {
      return (
        <section className="main-calendar">
          <div className="title-service">????????????</div>
          <header className="calendar-header">
            <div className="row title-header">
              {this.renderDayLabel()}
            </div>
            <div className="row button-container">
              {/* <i
                className="box arrow fa fa-angle-left"
                onClick={this.showCalendar}
              /> */}
              <div onClick={this.showCalendar}>
                <i
                  className="box arrow fa fa-angle-left"
                />
                <span >????????????</span>
              </div>
              
              <div onClick={this.addEvent}>
                <i className="box event-button fa fa-plus-square"/>
                <span>?????? ?????? </span>
              </div>

              
            </div>
          </header>
          <Events
            selectedMonth={this.state.selectedMonth}
            selectedDay={this.state.selectedDay}
            selectedMonthEvents={this.state.selectedMonthEvents}
            removeEvent={i => this.removeEvent(i)}
          />
        </section>
      );
    } else {
      return (
        <section className="main-calendar">
          <header className="calendar-header">
            <div className="row title-header">
              <i
                className="box arrow fa fa-angle-left"
                onClick={this.previous}
              />
              <div className="box header-text">
                {this.renderTodayLabel()}
                {this.renderMonthLabel()}
              </div>
              <i className="box arrow fa fa-angle-right" onClick={this.next} />
            </div>
            <DayNames />
          </header>
          <div className="days-container">
            {this.renderWeeks()}
          </div>
        </section>
      );
    }
  }
}
// ????????? ?????? ??? ????????? ?????? (css transition ??????)
class Events extends React.Component {
  render() {
    const currentMonthView = this.props.selectedMonth;
    const currentSelectedDay = this.props.selectedDay;
    const monthEvents = this.props.selectedMonthEvents;
    const removeEvent = this.props.removeEvent;

    const monthEventsRendered = monthEvents.map((event, i) => {
      return (
        <div
          key={event.title}
          className="event-container"
          onClick={() => removeEvent(i)}
        >
          <CSSTransition
            component="div"
            className="animated-time"
            transitionName="time"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            <div className="event-time event-attribute">
              {/* {event.date.format("HH:mm")} */}
              <i class="far fa-check-square"></i>
              
            </div>
          </CSSTransition>
          <CSSTransition
            component="div"
            className="animated-title"
            transitionName="title"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            <div className="event-title event-attribute">{event.title}</div>
          </CSSTransition>
        </div>
      );
    });

    const dayEventsRendered = [];

    for (var i = 0; i < monthEventsRendered.length; i++) {
      if (monthEvents[i].date.isSame(currentSelectedDay, "day")) {
        dayEventsRendered.push(monthEventsRendered[i]);
      }
    }

    return (
      <div className="day-events">
        {dayEventsRendered}
      </div>
    );
  }
}
// ???- ??? ?????? ????????? ??????
class DayNames extends React.Component {
  render() {
    return (
      <div className="row days-header">
        <span className="box day-name">???</span>
        <span className="box day-name">???</span>
        <span className="box day-name">???</span>
        <span className="box day-name">???</span>
        <span className="box day-name">???</span>
        <span className="box day-name">???</span>
        <span className="box day-name">???</span>
      </div>
    );
  }
}
// ??? ?????? ????????? ??????
class Week extends React.Component {
  render() {
    let days = [];
    let date = this.props.previousCurrentNextView;
    let currentMonthView = this.props.currentMonthView;
    let selected = this.props.selected;
    let select = this.props.select;
    let monthEvents = this.props.monthEvents;

    for (var i = 0; i < 7; i++) {
      var dayHasEvents = false;

      for (var j = 0; j < monthEvents.length; j++) {
        if (monthEvents[j].date.isSame(date, "day")) {
          dayHasEvents = true;
        }
      }

      let day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === currentMonthView.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date,
        hasEvents: dayHasEvents
      };

      days.push(<Day day={day} selected={selected} select={select} />);
      date = date.clone();
      date.add(1, "d");
    }
    return (
      <div className="row week">
        {days}
      </div>
    );
  }
}
// ???????????? ?????? ??????
class Day extends React.Component {
  render() {
    let day = this.props.day;
    let selected = this.props.selected;
    let select = this.props.select;

    return (
      <div
        className={
          "day" +
          (day.isToday ? " today" : "") +
          (day.isCurrentMonth ? "" : " different-month") +
          (day.date.isSame(selected) ? " selected" : "") +
          (day.hasEvents ? " has-events" : "")
        }
        onClick={() => select(day)}
      >
        <div className="day-number">{day.number}</div>
      </div>
    );
  }
}

ReactDOM.render(<Calendar />, document.getElementById("calendar-content"));
