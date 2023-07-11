import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../api/ApiHelper";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { toastMessage } from "../../utils/toasfiy";

export default function Rank() {
  const [rank, setRank] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state;

  useState(() => {
    const getWords = async () => {
      try {
        const { data } = await axiosInstance.post("ranks", { score: score });
        setRank(Math.round(data.rank));
        toastMessage("success", `your rank is ${Math.round(data.rank)}`);
      } catch (err) {
        console.log(err);
      }
    };

    getWords();
  }, []);

  return (
    <div className="container">
      <div className="  text-center bg-light p-5  mt-5 d-flex justify-content-center rounded-2 border border-1 border-info shadow ">
        {rank == 0 ? (
          <Spinner animation="border" variant="info" />
        ) : (
          <div className="">
            <Alert variant="info" className="w-100">
              <strong className="me-2 lead">Your Rank is: </strong>
              <span
                className="badge bg-light text-success "
                style={{ fontSize: "1.0rem" }}
              >
                {rank}
              </span>
            </Alert>
            <Button
              variant="info"
              className=" text-white px-4"
              onClick={(_) => {
                navigate("/");
              }}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
