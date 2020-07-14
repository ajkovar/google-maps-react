import React, { useRef, useEffect } from 'react';

function createPopupClass() {
  function Popup({ position, content, map }) {
    this.position = position;
    this.containerDiv = content;
    this.setMap(map);
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
  }

  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  Popup.prototype.onAdd = function () {
    this.getPanes().floatPane.appendChild(this.containerDiv);
  };

  Popup.prototype.onRemove = function () {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv);
    }
  };

  Popup.prototype.draw = function () {
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
    var display =
      Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
        ? 'block'
        : 'none';

    if (display === 'block') {
      this.containerDiv.style.left = divPosition.x + 'px';
      this.containerDiv.style.top = divPosition.y + 'px';
    }
    if (this.containerDiv.style.display !== display) {
      this.containerDiv.style.display = display;
    }
  };

  return Popup;
}

const CustomPopup = ({ map, position, children }) => {
  const containerEl = useRef(null);
  useEffect(() => {
    const pos = new google.maps.LatLng(position.lat, position.lng);
    const Popup = createPopupClass();
    const popup = new Popup({
      position: pos,
      content: containerEl.current,
      map,
    });
  });
  return (
    <div
      style={{ position: 'absolute' }}
      className="custom-popup"
      ref={containerEl}
    >
      {children}
    </div>
  );
};

export default CustomPopup;
