import "./KoiTable.css";
import { useState, useEffect } from "react";

export default function KoiTable({ name, id, rating, sex, length, breeder, age, status, endTime }) {
    return (
        <>
        <div className="table-container">
            <div className="table-header">
                <div className="table-title">
                    <h2>{name}</h2>
                    <div className="rating">
                        <Rating rating={rating} />
                    </div>
                </div>
                <div className="table-info">
                    <div className="card-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                                <circle cx={7.5} cy={7.5} r={0.5} fill="currentColor"></circle>
                            </g>
                        </svg>
                        <div>{id}</div>
                    </div>
                    <h2 className="Status"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"></path><rect width={2} height={7} x={11} y={6} fill="currentColor" rx={1}><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></rect><rect width={2} height={9} x={11} y={11} fill="currentColor" rx={1}><animateTransform attributeName="transform" dur="3s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></rect></svg>
                        <div>{status}</div></h2>
                </div>
            </div>
            <div className="table-details">
                <div className="detail-item">
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                            <path fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14V4.5a2.5 2.5 0 0 0-5 0V14m5-6l6-5l8 6m-2-5v10m-8-4h4v4h-4zM2 14h20M2 22l5-8m0 8l5-8m10 8H12l5-8m-2 4h7"></path>
                        </svg>
                    </span>
                    Breeder: {breeder}
                </div>
                <div className="detail-item">
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256">
                            <path fill="black" d="m235.32 73.37l-52.69-52.68a16 16 0 0 0-22.63 0L20.68 160a16 16 0 0 0 0 22.63l52.69 52.68a16 16 0 0 0 22.63 0L235.32 96a16 16 0 0 0 0-22.63M84.68 224L32 171.31l32-32l26.34 26.35a8 8 0 0 0 11.32-11.32L75.31 128L96 107.31l26.34 26.35a8 8 0 0 0 11.32-11.32L107.31 96L128 75.31l26.34 26.35a8 8 0 0 0 11.32-11.32L139.31 64l32-32L224 84.69Z"></path>
                        </svg>
                    </span>
                    Length: {length} cm
                </div>
                <div className="detail-item">
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256">
                            <path fill="black" d="M208 24h-40a8 8 0 0 0 0 16h20.69l-25.15 25.15A64 64 0 1 0 112 175.48V192H88a8 8 0 0 0 0 16h24v24a8 8 0 0 0 16 0v-24h24a8 8 0 0 0 0-16h-24v-16.52a63.92 63.92 0 0 0 45.84-98L200 51.31V72a8 8 0 0 0 16 0V32a8 8 0 0 0-8-8m-88 136a48 48 0 1 1 48-48a48.05 48.05 0 0 1-48 48"></path>
                        </svg>
                    </span>
                    Sex: {sex}
                </div>
                <div className="detail-item">
                    <span className="icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                        >
                            <g fill="none" fillRule="evenodd">
                                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                                <path
                                    fill="black"
                                    d="M18 9a3 3 0 0 1 2.995 2.824L21 12v3c0 .64-.379 1.139-.882 1.367l-.118.047V20a2 2 0 0 1-1.85 1.995L18 22H6a2 2 0 0 1-1.995-1.85L4 20v-3.585a1.49 1.49 0 0 1-.993-1.27L3 15v-3a3 3 0 0 1 2.824-2.995L6 9zm-.067 6.7a1 1 0 0 0-1.09-.072l-.11.072l-.266.2a3 3 0 0 1-3.429.12l-.171-.12l-.267-.2a1 1 0 0 0-1.09-.072l-.11.072l-.267.2a3 3 0 0 1-3.428.12l-.172-.12l-.266-.2a1 1 0 0 0-1.09-.072l-.11.072l-.067.05V20h12v-4.25zM18 11H6a1 1 0 0 0-1 1v2.005a3 3 0 0 1 3.467.095l.266.2a1 1 0 0 0 1.2 0l.267-.2a3 3 0 0 1 3.6 0l.267.2a1 1 0 0 0 1.2 0l.266-.2A3 3 0 0 1 19 14.005V12a1 1 0 0 0-1-1m-5.4-8.8a9 9 0 0 1 1.147 1.073C14.271 3.862 15 4.855 15 6a3 3 0 1 1-6 0c0-1.145.73-2.138 1.253-2.727A9 9 0 0 1 11.4 2.2a1 1 0 0 1 1.2 0M12 4.334a6 6 0 0 0-.253.268C11.271 5.138 11 5.645 11 6a1 1 0 1 0 2 0c0-.355-.27-.862-.747-1.398A6 6 0 0 0 12 4.334"
                                ></path>
                            </g>
                        </svg>
                    </span>
                    Age: {age}
                </div>
            </div>
           
        </div>
        <>   <CountdownTimer endTime={endTime} /></>
        </>
    );
}

const Rating = ({ rating }) => {
    const stars = Array(rating).fill(0);

    return (
        <div className={rating}>
            {stars.map((_, index) => (
                <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 24 24"

                >
                    <path
                        fill="#4685af"
                        d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
                    ></path>
                </svg>
            ))}
        </div>
    );
};
const CountdownTimer = ({ endTime }) => {
    console.log(endTime)
    const calculateTimeLeft = () => {
        const difference = new Date("2024-10-20T20:00:00") - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return (
        <div className="countdown-timer">
            <h2>Time left:</h2>
            <div className="time">
                <span>
                    {timeLeft.hours || "00"}
                    <small>Hours</small>
                </span>
                <span>
                    {timeLeft.minutes || "00"}
                    <small>Minutes</small>
                </span>
                <span>
                    {timeLeft.seconds || "00"}
                    <small>Seconds</small>
                </span>
            </div>
        </div>
    );
}