import React from 'react';
import OpenViduVideoComponent from './OvVideo';
// import './UserVideo.css';

const UserVideoComponent = (props) => {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    console.log(JSON.parse(props.streamManager.stream.connection.data).clientData);
    return JSON.parse(props.streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {props.streamManager !== undefined ? (
        <div className="streamcomponent">
          {/* <p>{getNicknameTag()}</p> */}
          <OpenViduVideoComponent streamManager={props.streamManager} />
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;