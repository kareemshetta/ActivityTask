import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../api/ApiHelper";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
export default function Rank() {
  const [rank, setRank] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state;

  useState(() => {
    const getWords = async () => {
      try {
        const { data } = await axiosInstance.post("ranks", { score: score });
        setRank(data.rank);
      } catch (err) {
        console.log(err);
      }
    };

    getWords();
  }, []);

  return (
    <div className=" container text-center bg-light p-5  mt-5 d-flex justify-content-center ">
      {rank == 0 ? (
        <Spinner animation="border" variant="info" />
      ) : (
        <div className="">
          <Alert variant="info" className="w-100">
            <strong className="me-2 font-weight-bold">Your Rank is: </strong>
            {rank}
          </Alert>
          <Button
            className="btn-info"
            onClick={(_) => {
              navigate("/");
            }}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
