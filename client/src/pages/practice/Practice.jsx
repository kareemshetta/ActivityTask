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
      navigate("/rank", {
        state: { score: calculateScore(score, wordList.length) },
      });
    }
  }, [isFinish]);

  const calculateScore = (score, total) => {
    return (score / total) * 100;
  };
  const handleSubmitButton = (_) => {
    // here we check if he choose correct answer just update score
    // setCorrect answer True so we can give user feedback
    if (selectedValue === wordList[questionNo].pos) {
      setCorrectAnswer(true);

      setScore((prevScore) => prevScore + 1);
      console.log("score is :", score);
    }
    // here we make sure he can't submit until user choose value
    if (selectedValue !== "") {
      setSubmit(true);
      setDisabled(true);
      if (questionNo == 9) {
        setIsFinished(true);
      }
    }
  };

  const handleNextButton = (_) => {
    // here we make sure that he can't move to next question until
    //there're question and user selected value and click submit button
    if (questionNo !== 9 && selectedValue != "" && submit) {
      setQuestionNo((prevQuestionNo) => prevQuestionNo + 1);
      // here we rest our state
      setCorrectAnswer(false);
      setSelectedValue((pre) => "");
      selectedRadioButton.current = null;
      setSubmit(false);
      setDisabled(false);
      console.log(questionNo);
    }
  };
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
            onClick={handleSubmitButton}
          >
            Submit
          </Button>
          <Button
            variant="outline-success"
            className="me-5 px-4"
            onClick={handleNextButton}
          >
            Next
          </Button>

          <ProgressBar
            className="w-100"
            now={calculateScore(score, wordList.length)}
            label={calculateScore(score, wordList.length) + `%`}
          />
        </div>
      </div>
    </Container>
  );
}
