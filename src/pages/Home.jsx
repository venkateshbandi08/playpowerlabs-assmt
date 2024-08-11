import React, { useState, useEffect } from "react";
import "./Home.css";
import TimeSlider from "../components/TimeSlider";
import moment from "moment-timezone";
import { LuArrowDownUp } from "react-icons/lu";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from "../components/ThemeContext";

const TimeConverter = () => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTimezones, setSelectedTimezones] = useState([]);
  const [baseTime, setBaseTime] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSelectedTimezones((prevTimezones) =>
      prevTimezones.map((timezone) => {
        const updatedTime = moment(baseTime)
          .tz(timezone.name)
          .format("YYYY-MM-DDTHH:mm:ss");
        return { ...timezone, currentTime: updatedTime };
      })
    );
  }, [baseTime]);

  const handleInputChange = (event) => {
    const input = event.target.value;
    setSearchInput(input);

    if (input.length > 0) {
      const timezoneSuggestions = moment.tz
        .names()
        .filter((timezone) =>
          timezone.toLowerCase().includes(input.toLowerCase())
        );
      setSuggestions(timezoneSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleTimezoneClick = (timezone) => {
    const tzMoment = moment.tz(timezone).set({
      year: moment(selectedDate).year(),
      month: moment(selectedDate).month(),
      date: moment(selectedDate).date(),
    });
    const gmtOffset = tzMoment.utcOffset() / 60;
    const abbreviation = tzMoment.format("z");
    const formattedDate = tzMoment.format("ddd, MMM D");

    const newTimezone = {
      name: timezone,
      abbreviation: abbreviation,
      gmtOffset: gmtOffset,
      date: formattedDate,
      currentTime: tzMoment.format("YYYY-MM-DDTHH:mm:ss"),
    };

    setSelectedTimezones((prevTimezones) => [...prevTimezones, newTimezone]);
    setSearchInput("");
    setSuggestions([]);
  };

  const handleTimeChange = (index, newTime) => {
    setBaseTime(newTime);
  };

  const handleReverseTimezones = () => {
    setSelectedTimezones((prevTimezones) => [...prevTimezones].reverse());
  };

  const handleDeleteTimezone = (index) => {
    setSelectedTimezones((prevTimezones) =>
      prevTimezones.filter((_, i) => i !== index)
    );
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);

    setSelectedTimezones((prevTimezones) =>
      prevTimezones.map((timezone) => {
        const updatedTime = moment
          .tz(newDate, "YYYY-MM-DD", timezone.name)
          .set({
            hour: moment(timezone.currentTime).hour(),
            minute: moment(timezone.currentTime).minute(),
            second: moment(timezone.currentTime).second(),
          })
          .format("YYYY-MM-DDTHH:mm:ss");

        return { ...timezone, currentTime: updatedTime };
      })
    );
  };

  return (
    <div
      className={`app-container ${theme}`}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className={`home-container ${theme}`}
        style={{
          display: "flex",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <h1 className="main-heading">Time Converter</h1>
        <div className="timeHeaderContainer">
          <div className="time-searchbar-container">
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Search timezones..."
              className={`search-bar ${theme}`}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`suggestion-item ${theme}`}
                    onClick={() => handleTimezoneClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <input
              type="date"
              className="search-bar"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="time-tools-container">
            <div className="time-tool" onClick={handleReverseTimezones}>
              <LuArrowDownUp />
            </div>
            <div className="time-tool" onClick={toggleTheme}>
              <MdDarkMode />
            </div>
          </div>
        </div>

        <div className="timezones-list">
          {selectedTimezones.length === 0 ? (
            <h2 style={{ textAlign: "center" }}>
              No selected timezones found! Select any
            </h2>
          ) : (
            selectedTimezones.map((timezone, index) => (
              <TimeSlider
                key={timezone.name}
                timezone={timezone}
                baseTime={baseTime}
                onTimeChange={(newTime) => handleTimeChange(index, newTime)}
                onDelete={() => handleDeleteTimezone(index)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;
