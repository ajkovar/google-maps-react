import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function createPopupClass() {
  function Popup({ position, content, map, passThroughMouseEvents }) {
    this.position = position;
    this.containerDiv = content;
    this.setMap(map);
    if (!passThroughMouseEvents) {
      google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
  }

  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  Popup.prototype.show = function () {
    this.containerDiv.style.visibility = 'visible';
  };

  Popup.prototype.hide = function () {
    this.containerDiv.style.visibility = 'hidden';
  };

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

const CustomOverlay = ({
  map,
  position,
  children,
  visible,
  google,
  className,
  passThroughMouseEvents
}) => {
  const containerEl = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (map) {
      const pos = new google.maps.LatLng(position.lat, position.lng);
      const Popup = createPopupClass();
      popoverRef.current = new Popup({
        position: pos,
        content: containerEl.current,
        map,
        passThroughMouseEvents
      });
    }
  }, [map]);

  useEffect(() => {
    const popover = popoverRef.current;
    if (popover) {
      visible ? popover.show() : popover.hide();
    }
  }, [visible]);

  return (
    <div
      className={className}
      style={{ position: 'absolute' }}
      ref={containerEl}
    >
      {visible && children}
    </div>
  );
};

CustomOverlay.propTypes = {
  google: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
  map: PropTypes.object,
  position: PropTypes.object,
  visible: PropTypes.bool,
  passThroughMouseEvents: PropTypes.bool
};

CustomOverlay.defaultProps = {
  visible: true
};
export default CustomOverlay;
