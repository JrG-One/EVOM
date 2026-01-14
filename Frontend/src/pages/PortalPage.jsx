import { Button } from "../components/ui/button";

import { useNavigate } from "react-router-dom";

const PortalPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="p-4 m-4 bg-accent border rounded-lg">
        <div className="text-2xl font-bold">
          Ready For your next practice session?
        </div>
        <div className="text-md">
          Our AI-powered mock interviews adapt to your skill level and provide
          instant feedback. Choose from technical, behavioral, or full-stack
          interviews based on your needs.
        </div>
        <Button
          className="cursor-pointer mt-4"
          onClick={() => navigate("/start-interview")}
        >
          Start Interview
        </Button>
      </div>
    </>
  );
};

export default PortalPage;
