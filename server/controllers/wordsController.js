const { response } = require("express");
const fs = require("fs");

let data = fs.readFileSync("TestData.json");
const { wordList, scoresList } = JSON.parse(data);

exports.getRandomWords = (request, response, next) => {
  const wordsList = [];
  let hasAdv = false;
  let hasAdj = false;
  let hasNoun = false;
  let hasVerb = false;
  while (wordsList.length < 10) {
    let randNum = Math.floor(Math.random() * wordList.length);

    // the  first four if to make sure that list have {adjective ,noun, adverb ,verb}
    if (wordList[randNum].pos === "adjective" && hasAdj == false) {
      hasAdj = true;
      wordsList.push(wordList[randNum]);
    }

    if (wordList[randNum].pos === "noun" && hasNoun == false) {
      hasNoun = true;
      wordsList.push(wordList[randNum]);
    }
    if (wordList[randNum].pos === "adverb" && hasAdv == false) {
      hasAdv = true;
      wordsList.push(wordList[randNum]);
    }
    if (wordList[randNum].pos === "verb" && hasVerb == false) {
      hasVerb = true;
      wordsList.push(wordList[randNum]);
    }

    // this if check will be true when (wordsList have (verb ,noun,adjective,adverb))
    // the value that make list length 4 will be pushed twice
    if (hasAdj && hasAdv && hasNoun && hasVerb) {
      // i have to check if the length 4
      if (wordsList.length === 4) {
        // if length is 4 i have to create extra if check because if
        //randNum is last index of the array i have to push with randNum-1
        //so not pushing null value
        if (randNum === wordList.length - 1) {
          console.log("okey", randNum, wordsList.length);
          wordsList.push(wordList[randNum - 1]);
        }
        // i  have to push with randNum +1 so we get ride of dublication
        else {
          console.log("mooooo", randNum, wordsList.length);
          wordsList.push(wordList[randNum + 1]);
        }
        // this will be triggred when wordslist length is not greater than 4
      } else {
        wordsList.push(wordList[randNum]);
        console.log("loooo", randNum);
      }

      // }
    }
  }
  response.status(200).json({ wordsList });
};

function calculateRank(scoresList, score) {
  // this belowScore is list filterd from value greater than score
  const belowScores = scoresList.filter((s) => s < score);
  console.log(belowScores);
  //calculate rank
  const rank = (belowScores.length / scoresList.length) * 100;
  return rank.toFixed(2);
}

exports.rank = (request, response, next) => {
  const finalScore = request.body.score;

  let rank = calculateRank(scoresList, finalScore);
  `The rank percentage for a final score of ${finalScore} is ${rank}%`;
  response.status(200).json({ rank: rank });
};
