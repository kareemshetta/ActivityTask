import React, { useRef, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axiosInstance from "../../api/ApiHelper";
import { useNavigate } from "react-router-dom";
export default function Practice() {
  const pos = ["verb", "adverb", "noun", "adjective"];
  const selectedRadioButton = useRef(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [wordList, setWordList] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNo, setQuestionNo] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isFinish, setIsFinished] = useState(false);
  const navigate = useNavigate();
  const handleRadioClick = (event) => {
    selectedRadioButton.current = event.target;

    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    const getWords = async () => {
      try {
        const { data } = await axiosInstance.get("words");
        console.log("data", data.wordsList);
        setWordList([...data.wordsList]);
      } catch (err) {
        console.log(err);
      }
    };

    getWords();
  }, []);
  useEffect(() => {
    if (isFinish && submit) {
      navigate("/rank", { state: { score: (score / wordList.length) * 100 } });
    }
  }, [isFinish]);
  useEffect(() => {
    console.log("Selected value:", selectedValue);
    console.log(
      "Selected value from radio:",
      selectedRadioButton?.current?.value
    );
  }, [selectedValue]);

  return (
    <Container className="text-start mt-5 bg-light p-5 rounded-2 ">
      <Alert key={"light"} variant={"light"} className="px-4 fs-5 lead">
        <strong className="me-2 font-weight-bold">
          #question{questionNo + 1}
        </strong>
        choose the correct pos for
        <strong className="mx-2 font-weight-bold text-success">
          {wordList.length == 0 ? "" : wordList[questionNo].word}
        </strong>
      </Alert>
      <Form>
        {pos.map((pos, index) => (
          <Alert
            style={{ cursor: "pointer" }}
            variant={
              selectedValue === `${pos}` && correctAnswer && submit
                ? "success"
                : selectedValue === `${pos}` && !correctAnswer && submit
                ? "danger"
                : selectedValue === `${pos}`
                ? "primary"
                : "light"
            }
            key={index}
          >
            <Form.Check
              onChange={handleRadioClick}
              checked={selectedValue === `${pos}` ? true : false}
              value={pos}
              label={pos}
              disabled={disabled}
              name="group1"
              type="radio"
              id={`inline-radio-${index}`}
            />
          </Alert>
        ))}
      </Form>
      <div>
        <div className="d-flex justify-content-start align-items-center">
          <Button
            variant="outline-primary"
            className="me-5"
            onClick={(_) => {
              if (selectedValue === wordList[questionNo].pos) {
                setCorrectAnswer(true);

                setScore((prevScore) => prevScore + 1);
                console.log("score is :", score);
              }
              if (selectedValue != "") {
                setSubmit(true);
                setDisabled(true);
                if (questionNo == 9) {
                  setIsFinished(true);
                }
              }
            }}
          >
            Submit
          </Button>
          <Button
            variant="outline-success"
            className="me-5 px-4"
            onClick={(_) => {
              if (questionNo !== 9 && selectedValue != "" && submit) {
                setQuestionNo((prevQuestionNo) => prevQuestionNo + 1);
                setCorrectAnswer(false);
                setSelectedValue((pre) => "");
                selectedRadioButton.current = null;
                setSubmit(false);
                setDisabled(false);
                console.log(questionNo);
              }
            }}
          >
            Next
          </Button>

          <ProgressBar
            className="w-100"
            now={(score / wordList.length) * 100}
            label={(score / wordList.length) * 100 + `%`}
          />
        </div>
      </div>
    </Container>
  );
}

{
  /* <div key={`inline-${type}`} className="mb-3"> */
}
{
  /* <div
            className="bg-light py-3 px-4 my-2 border-end border-4    "
            style={{ borderRadius: " 10px 0px 0px 10px" }}
          /> */
}
/* 
        <Alert variant={selectedValue === `noun` ? "primary" : "light"}>
          <Form.Check
            onChange={handleRadioClick}
            value={"noun"}
            label="noun"
            name="group1"
            type="radio"
            id={`inline-radio-1`}
          />
        </Alert>
        <Alert variant={selectedValue === `adjective` ? "primary" : "light"}>
          <Form.Check
            onChange={handleRadioClick}
            value={"adjective"}
            label="adjective"
            name="group1"
            type="radio"
            id={`inline-radio-1`}
          />
        </Alert> */
