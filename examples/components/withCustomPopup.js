import React from 'react';
import Map from '../../src/index';
import CustomPopup from '../../src/components/CustomPopup';

const WithCustomPopup = (props) => {
  if (!props.loaded) return <div>Loading...</div>;

  return (
    <Map
      google={props.google}
      className="map"
      style={{ height: '100%', position: 'relative', width: '100%' }}
      zoom={14}
    >
      <CustomPopup position={{ lat: 37.782551, lng: -122.445368 }}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          Hi there. I'm a custom popup.
        </div>
      </CustomPopup>
    </Map>
  );
};

export default WithCustomPopup;
