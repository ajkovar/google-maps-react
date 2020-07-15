import React, { useState } from 'react';
import Map from '../../src/index';
import CustomPopup from '../../src/components/CustomPopup';
import styles from './withCustomPopup.module.css';

const WithCustomPopup = (props) => {
  const [showPopup, setShowPopup] = useState(true);
  if (!props.loaded) return <div>Loading...</div>;

  return (
    <div>
      <Map
        google={props.google}
        className="map"
        style={{ height: '100%', position: 'relative', width: '100%' }}
        zoom={14}
      >
        <CustomPopup
          position={{ lat: 37.782551, lng: -122.425368 }}
          visible={showPopup}
        >
          <div className={styles.customPopup}>
            Hi there. I'm a custom popup.
          </div>
        </CustomPopup>
        <button
          className={styles.button}
          onClick={() => setShowPopup(!showPopup)}
        >
          Toggle Popup
        </button>
      </Map>
    </div>
  );
};

export default WithCustomPopup;
