import React, { useRef, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";

import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axiosInstance from "../../api/ApiHelper";
import { useNavigate } from "react-router-dom";
import { toastMessage } from "../../utils/toasfiy";
import style from "./Practice.module.css";
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
  const [next, setNext] = useState(false);
  const [isFinish, setIsFinished] = useState(false);
  const navigate = useNavigate();

  // this fuction is used for getting value for checked radio button
  // and setSelectedValue to value from checked radio button
  const handleRadioClick = (event) => {
    selectedRadioButton.current = event.target;

    setSelectedValue(event.target.value);
  };
  // this useEffect will be triggred when this screen first renderd
  // we will use to get the list of questions we need
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
    // this useEffect will be triggred when ever isFinish value changes
    // if isFinish is true and user submit last answer
    // user will be navigated to rank screen
    if (isFinish && submit) {
      navigate("/rank", {
        state: { score: calculateScore(score, wordList.length) },
      });
    }
  }, [isFinish]);
  // this function is just for calculate score
  const calculateScore = (score, total) => {
    return (score / total) * 100;
  };
  // this function has two roles one for submit answer
  // and other one for change question
  const handleSubmitButton = (_) => {
    // this condition if is met ,this means that user submit answer and now
    // we can move to another question
    if (next) {
      handleContinueButton();
    } else {
      // this means we are in submit role
      // here we check if he choose correct answer just update score
      // setCorrect answer True so we can give user feedback
      if (selectedValue === wordList[questionNo].pos) {
        // showing correct toast message when user choose correct answer
        toastMessage("success", "Bravo correct 👏👏");
        setCorrectAnswer(true);

        setScore((prevScore) => prevScore + 1);
        console.log("score is :", score);
      } else {
        // showing incorrect toast message when user choose wrong answer
        toastMessage("error", "sorry wrong  😢😢 ");
      }
      // here we make sure he can't submit until user choose value
      if (selectedValue !== "") {
        setSubmit(true);
        // this will make submit button unclickable
        setDisabled(true);
        // so submit button can work as continue button
        setNext(true);
        if (questionNo == 9) {
          // here we set isFinish to true so user can be navigated to
          // rank screen
          setIsFinished(true);
        }
      }
    }
  };

  const handleContinueButton = (_) => {
    // here we make sure that he can't move to next question until
    //there're question and user selected value and click submit button

    if (questionNo !== 9 && selectedValue != "") {
      console.log("hi");
      setQuestionNo((prevQuestionNo) => prevQuestionNo + 1);
      // here we rest our state
      setCorrectAnswer(false);
      setSelectedValue((pre) => "");
      selectedRadioButton.current = null;
      setSubmit(false);
      setDisabled(false);
      console.log(questionNo);
    }
    setNext(false);
  };
  return (
    <div className={` d-flex justify-content-center aligh-items-center`}>
      <Container className="text-start mx-2 my-4   bg-light p-5 rounded-2 border border-1 border-info shadow ">
        <p
          className={`${style["flex-width"]} lead text-white bg-info rounded mx-2 text-center  w-md-25  p-1 shadow`}
        >
          let's practice right now
        </p>

        <Alert key={"light"} variant={"light"} className="px-4 fs-5 lead">
          <strong className="me-2 font-weight-bold">
            #question{questionNo + 1}
          </strong>
          choose the correct <strong>POS</strong> for this word
          <strong className="mx-2 font-weight-bold text-primary">
            {wordList.length == 0 ? "" : wordList[questionNo].word}
          </strong>
        </Alert>
        <Form>
          {pos.map((pos, index) => (
            <Alert
              style={{ cursor: "pointer" }}
              variant={
                // selected alert changes it's color according user answer
                // if user just select choise this alert color will change to light blue
                // if select and user submit amswer and his answer is correct this alert color
                // will change to green
                //  if select and user submit amswer and his answer is incorrect this alert color
                // will change to red
                // if no one of this condition is met just color this alert with color light grey
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
                // so we can remove checked from this radio button according to
                // selected value and we want to uncheck all option when new question is shown
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
              variant={next ? "outline-info" : "outline-success"}
              className="px-5 me-5"
              onClick={handleSubmitButton}
              disabled={selectedValue == ""}
            >
              {!next ? "submit" : "continue"}
            </Button>

            <ProgressBar
              striped
              style={{ height: "35px" }}
              variant="info"
              className="w-75"
              now={calculateScore(score, wordList.length)}
              label={calculateScore(score, wordList.length) + `%`}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
