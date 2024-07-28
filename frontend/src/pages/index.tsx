import { FC } from "react";
import { Link } from "react-router-dom";

interface PropTypes {}

const Index: FC<PropTypes> = () => {
  return (
    <div>
      <h1>WebRTC Sample</h1>
      <div>
        <Link to="/basic">Basic</Link>
      </div>
      <div>
        <Link to="/advanced">Advanced</Link>
      </div>
      <div>
        <Link to="/screen-share">Screen Share</Link>
      </div>
    </div>
  );
};

export default Index;
