import React, { useState } from "react";
import { FigmaAsset } from "./ui";

export function LaunchScreen({ dialogRef, label, onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem("progrize-launch-interest") || "[]");
      const entries = Array.isArray(saved) ? saved : [];
      if (!entries.includes(email.trim().toLowerCase())) entries.push(email.trim().toLowerCase());
      window.localStorage.setItem("progrize-launch-interest", JSON.stringify(entries));
      setStatus("Thanks! Your email is saved on this device. Launch notifications are not connected yet.");
    } catch {
      setStatus("Your email could not be saved. Please try again.");
    }
  };
  return (
    <dialog className="modal launch-screen" data-lenis-prevent ref={dialogRef} aria-label={label} aria-describedby="launch-description" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
      <div className="launch-canvas">
      <div className="launch-grid" aria-hidden="true">
        <FigmaAsset section="112:630" name="imgGroup" className="launch-grid-lines" />
        <FigmaAsset section="112:630" name="imgGroup1" className="launch-grid-curves" />
      </div>
      <div className="launch-photo"><FigmaAsset section="112:630" name="imgImage7" alt="A man and colourful creatures sharing an elevator" /></div>
      <button type="button" className="modal-close launch-close" onClick={onClose} aria-label="Close dialog">Close<FigmaAsset section="112:630" name="imgArrowUpRight" /></button>
      <div className="launch-content">
        <h2>Thanks for the curiosity</h2>
        <p id="launch-description">The app isn’t live just yet, but we’ll let you know the moment it launches!</p>
        <form onSubmit={submit}>
          <label className="sr-only" htmlFor="launch-email">Your email address</label>
          <input id="launch-email" name="email" type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(event) => { setEmail(event.target.value); setStatus(""); }} required />
          <button type="submit" className="launch-submit">Submit<FigmaAsset section="112:630" name="imgArrowUpRight1" /></button>
        </form>
        {status && <p className="launch-status success" role="status">{status}</p>}
      </div>
      <div className="launch-mascot" aria-hidden="true"><FigmaAsset section="112:630" name="imgImage8" /></div>
      </div>
    </dialog>
  );
}
