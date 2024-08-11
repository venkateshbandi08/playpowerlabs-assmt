import React, { useState, useEffect } from "react";
import Slider from "react-slider";
import "./TimeSlider.css";
import moment from "moment";
import { useTheme } from "./ThemeContext";

const TimeSlider = ({ timezone, baseTime, onTimeChange, onDelete }) => {
  const { theme } = useTheme();
  const [sliderValue, setSliderValue] = useState(() => {
    const initialMinutes =
      moment(baseTime).tz(timezone.name).hours() * 60 +
      moment(baseTime).tz(timezone.name).minutes();
    return initialMinutes;
  });

  const timezoneTime = moment(baseTime).tz(timezone.name);

  const formatTime = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${suffix}`;
  };

  const marks = [
    { value: 0, label: "12 AM" },
    { value: 180, label: "3 AM" },
    { value: 360, label: "6 AM" },
    { value: 540, label: "9 AM" },
    { value: 720, label: "12 PM" },
    { value: 900, label: "3 PM" },
    { value: 1080, label: "6 PM" },
    { value: 1260, label: "9 PM" },
    { value: 1440, label: "12 AM" },
  ];

  useEffect(() => {
    const minutes =
      moment(baseTime).tz(timezone.name).hours() * 60 +
      moment(baseTime).tz(timezone.name).minutes();
    setSliderValue(minutes);
  }, [baseTime, timezone.name]);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    const newTime = moment(baseTime)
      .startOf("day")
      .add(value, "minutes")
      .toISOString();
    onTimeChange(newTime);
  };

  return (
    <div className={`time-range-slider ${theme}`}>
      <h3
        style={{ textAlign: "right", marginTop: "-25px", cursor: "pointer" }}
        onClick={onDelete}
      >
        X
      </h3>
      <div className="time-details-container">
        <div className="time-standard-container">
          <div className="standard-container">
            <h2 style={{ marginTop: "-20px" }}>{timezone.name}</h2>
          </div>
          <p className="standard-fullform"></p>
        </div>
        <div className="selected-time-container">
          <div className={`selected-time ${theme}`}>
            {timezoneTime.format("h:mm A")}
          </div>
          <div className="date-standard-container">
            <p>
              {timezone.gmtOffset >= 0
                ? `GMT +${timezone.gmtOffset}`
                : `GMT ${timezone.gmtOffset}`}
            </p>
            <p>{timezoneTime.format("ddd, MMM D")}</p>
          </div>
        </div>
      </div>

      <Slider
        min={0}
        max={1440}
        step={15}
        value={sliderValue}
        onChange={handleSliderChange}
        renderTrack={(props) => <div {...props} className="track" />}
        renderThumb={(props) => <div {...props} className="thumb" />}
      />

      <div className="marks">
        {marks.map((mark) => (
          <div
            key={mark.value}
            className={`mark ${theme}`}
            style={{
              left: `${(mark.value / 1440) * 100}%`,
              paddingTop: "0.2rem",
            }}
          >
            {mark.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlider;
