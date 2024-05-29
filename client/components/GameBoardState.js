import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStates } from '../store/allStatesStore';
import { Button, Modal } from 'react-bootstrap';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
import WinModal from './WinModal';
import LossModal from './LossModal';
import ErrorModal from './ErrorModal';
import Error2Modal from './Error2Modal';
import OneAwayModal from './OneAwayModal';
import WrongModal from './WrongModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFootballBall } from '@fortawesome/free-solid-svg-icons';
import { faLandmark } from '@fortawesome/free-solid-svg-icons';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';
import {createWin} from '../store/allWinsStore'
import {createLoss} from '../store/allLossesStore'
import RecordModal from './RecordModal';



// Individual word card component
const WordCard = ({ word, onSelect, isSelected, image }) => {
  return (
    <div  className={`word-card2 ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(word)}>
      <div >{word}</div>
    </div>
  );
};

const mapIcons = Array.from({ length: 5 }, (_, index) => (
  <FontAwesomeIcon key={index} icon={faLandmark} style={{ marginRight: '5px' }} />
));




// Main game board component
const GameBoardState = () => {
  const userId = useSelector(state => state.auth);
  const user = useSelector(state => state.singleUser);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [submittedWords, setSubmittedWords] = useState([]);
  const [gameWords, setGameWords] = useState([]);
  const [picture, setPicture] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [row3, setRow3] = useState();
  const [row1, setRow1] = useState();
  const [row2, setRow2] = useState();
  const [row4, setRow4] = useState();
  const [lossWords, setLossWords] = useState({});
  const [showRecordModal, setShowRecordModal] = useState(false);
  const dispatch = useDispatch();
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showError2Modal, setShowError2Modal] = useState(false);
  const [showOneAwayModal, setShowOneAwayModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const allStates= useSelector((state) => state.allStates);

  useEffect(() => {
    dispatch(fetchStates());
  }, []);

  useEffect(() => {
    dispatch(fetchSingleUser(userId.id));
  }, [dispatch, userId]);

  const handleClose = () => setShowHowToPlayModal(false);
  const handleShow = () => {
    setShowHowToPlayModal(true)}


    const handleWin = () => {
      if (userId && userId.id) { // Check if userId exists and has a valid id
        // Define the win object
        const win = {
          userId: userId.id,
          category: 'State'
        };

        const updatedUser = {
          ...user,
          currentStreak: user.currentStreak + 1,
          recordStreak: Math.max(user.recordStreak, user.currentStreak + 1)
        };

        if (updatedUser.currentStreak > user.recordStreak) {
          setShowRecordModal(true);
        }

        // Update user streak in the database or through your API
        dispatch(updateSingleUser(updatedUser));
        // Dispatch the createWin action
        dispatch(createWin(win));
      }

      setShowWinModal(true);
      setShowConfetti(true);
    };

    const handleLoss = () => {
      if (userId && userId.id) { // Check if userId exists and has a valid id
        // Define the loss object
        const loss = {
          userId: userId.id,
          category: 'State'
        };

        const updatedUser = {
          ...user,
          currentStreak: 0
        };

        // Update user streak in the database or through your API
        dispatch(updateSingleUser(updatedUser));
        // Dispatch the createLoss action
        dispatch(createLoss(loss));
      }

      const groupedWords = gameWords.reduce((acc, word) => {
        const stateName = allStates.find(state=> state.cities.some(city => city.name === word.name)).name;
        if (!acc[stateName]) {
          acc[stateName] = [];
        }
        acc[stateName].push(word.name);
        return acc;
      }, {});

      setLossWords(groupedWords);

      setShowLossModal(true);
    };


  const handleError = () => {
    setShowErrorModal(true);

  };

  const handleError2 = () => {
    setShowError2Modal(true);
  };

  const handleOneAway= () => {
    setShowOneAwayModal(true);
  };



  const handleWrong= () => {
    setShowWrongModal(true);
  };



  const shuffleStatesAndCities = () => {
    // Use allStates from the redux store instead of the hardcoded states array
    const shuffledStates = [...allStates].sort(() => 0.5 - Math.random());

    // Select first 4 States
    const selectedStates = shuffledStates.slice(0, 4);

    // Extract and shuffle Cities from the selected States
    const selectedCities = selectedStates.flatMap(state =>
      state.cities.sort(() => 0.5 - Math.random()).slice(0, 4)
    ).sort(() => 0.5 - Math.random());

    setGameWords(selectedCities.map(city => ({
      name: city.name,
    })));
  };

  // Ensure this useEffect hook is called after your component is mounted and whenever allStates changes
  useEffect(() => {
    if (allStates.length > 0) {
      shuffleStatesAndCities();
    }
  }, [allStates]);



  useEffect(() => {
    // Check if the user has submitted 4 sets of 4 words
    if (submittedWords.length === 16) {
        handleWin(); // Show win modal
    }
  }, [submittedWords]);

  const toggleSelectWord = (word) => {
    const newSelection = new Set(selectedWords);

    // Check if the word is already selected, if so, remove it from the selection
    if (newSelection.has(word)) {
      newSelection.delete(word);
    } else {
      // Only add the new word if less than 4 are already selected
      if (newSelection.size < 4) {
        newSelection.add(word);
      } else {
        handleError()
      }
    }
    setSelectedWords(newSelection);
  };

  const handlePlayAgain = () => {
    // Reset the game state here
    setMistakes(0);
    setSubmittedWords([]);
    setGameWords([]);
    setPicture([]);
    setAnswer([]);
    setRow1(false);
    setRow2(false);
    setRow3(false);
    setRow4(false);
    setSelectedWords(new Set());
    setShowConfetti(false)
    setLossWords({});
    shuffleStatesAndCities();
  };

  const handleSubmit = () => {
    if (selectedWords.size === 4) {
      const selectedWordArray = Array.from(selectedWords);

      const stateImages = [];
      const stateNames = [];
      const matchingStates = [];

      // Check if there is a quarterback that matches three out of four cities
      const isSameState = allStates.some((state) => {
        const matchingCities = selectedWordArray.filter((cityName) =>
          state.cities.some((receiver) => receiver.name === cityName)
        );

        if (matchingCities.length === 3) {
          matchingStates.push(state.name);
        }

        const allCityMatch = matchingCities.length === 4;

        if (allCityMatch) {
          stateImages.push(state.imagePath); // Capture the State's image path when a match is found
          stateNames.push(state.name)
        }

        return allCityMatch;
      });

      if (isSameState) {
        // Correctly guessed all Cities from the same State
        const newSubmittedWords = [...submittedWords, ...selectedWordArray.map((cityName, idx) => ({ name: cityName, stateImagePath: stateImages[idx], stateName: stateNames[idx]  }))];
        setRow1(true)
        setSubmittedWords(newSubmittedWords);
        const images = [...picture]
        const answers = [...answer]

        images.push(stateImages)
        answers.push(stateNames)
        setPicture(images)
        setAnswer(answers)

        if (submittedWords.length === 4){
          setRow2(true)
        }

        if (submittedWords.length === 8){
          setRow3(true)
        }

        if (submittedWords.length === 12){
          setRow4(true)

        }

        // Remove correctly guessed Cities from the game board
        const remainingWords = gameWords.filter((city) => !selectedWords.has(city.name));

        setGameWords(remainingWords);

        setSelectedWords(new Set()); // Clear the selections
      } else {
        // Incorrect guess, handle mistake
        setMistakes((prev) => prev + 1);
        if (mistakes + 1 >= 5) {
          handleLoss(); // Show loss modal
        } else {
          // Check if there is only one quarterback matching three out of four cities
          if (matchingStates.length === 1) {
            handleOneAway()
          } else {
            handleWrong()
          }
          setSelectedWords(new Set());
        }
      }
    } else {
      // Show a popup message if less than 4 words are selected
      handleError2()

    }
  };


  const handleShuffle = () => {
    setGameWords(gameWords.sort(() => 0.5 - Math.random()));
    setSelectedWords(new Set()); // This will clear the selection
  };


  const handleDeselectAll = () => {
    setSelectedWords(new Set());
  };

  return (
       <div className="state-container">
    <div style={{ textAlign: 'center', margin: '20px' }}>
        <Button variant="link" onClick={handleShow}>
          <h3 style={{ color: 'black' }}>How To Play</h3>
        </Button>
      </div>
      <div className="confetti-container">
  {showConfetti && <Confetti />}
</div>
      {/* How To Play Modal */}
      <Modal show={showHowToPlayModal} onHide={handleClose} className="custom-modal">
        <Modal.Header>
          <Modal.Title>How To Play</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select 4 players who caught touchdowns from the same quarterback.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Render submitted words first */}
      {row1 ?
       <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
          <h2>1st: {answer[0]}</h2>
          <img src={picture[0]} alt="1st" className="picture-container" />
        </div>
      <div className='submitted-words first-row'>
  {/* Map over the first 4 words in submittedWords */}
  {submittedWords.slice(0, 4).map((word, index) => (
    <WordCard
      key={`submitted-${index}`}
      word={word.name}
      onSelect={() => {}}
      isSelected={false}
      image={word.stateImagePath} // Pass the State's image path
    />
  ))}
</div></div>: <div></div>}
      {row2 ?     <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
      <h2>2nd: {answer[1]}</h2>
      <img src={picture[1]} alt="1st" className="picture-container" />

    </div>
      <div className='submitted-words second-row'>
  {submittedWords.slice(4, 8).map((word, index) => (
    <WordCard
      key={`submitted-${index}`}
      word={word.name}
      onSelect={() => {}}
      isSelected={false}
      image={word.stateImagePath} // Pass the State's image path
    />
  ))}</div></div>: <div></div>}
       {row3 ?   <div> <div style={{ display: 'flex', flexDirection: 'column',  alignItems: 'center', margin: '10px 0' }}>
      <h2>3rd: {answer[2]}</h2>
      <img src={picture[2]} alt="1st" className="picture-container" />
    </div>  <div className='submitted-words third-row'>
  {submittedWords.slice(8, 12).map((word, index) => (
    <WordCard
      key={`submitted-${index}`}
      word={word.name}
      onSelect={() => {}}
      isSelected={false}
      image={word.stateImagePath} // Pass the State's image path
    />
  ))}</div></div>: <div></div>}

       {row4 ?  <div>
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
       <h2>4th: {answer[3]}</h2>
       <img src={picture[3]} alt="1st" className="picture-container" />
     </div>
          <div className='submitted-words winner'>
  {submittedWords.slice(12, 16).map((word, index) => (
    <WordCard
      key={`submitted-${index}`}
      word={word.name}
      onSelect={() => {}}
      isSelected={false}
      image={word.stateImagePath} // Pass the State's image path
    />
  ))}</div></div>: <div></div>}
<div>
    {/* Render submitted words first */}
    {mistakes !== 5 ? (
    <div className={`game-board ${gameWords.length === 12 ? 'adjusted' : ''}`}>
      {gameWords.map((word, index) => (
        <WordCard
          key={index}
          word={word.name}
          isSelected={selectedWords.has(word.name)}
          onSelect={toggleSelectWord}
        />
      ))}
    </div>
    ) : (
          <div className="correct-answers-container">
  <h2>Correct Answers:</h2>
  <div className="correct-answers">
    {Object.keys(lossWords).map((state, index) => (
      <div key={index} className="answer-block">
        <h3>{state}:</h3>
        <ul>
          {lossWords[state].map((city, idx) => (
            <li key={idx}>{city}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>
        )}

    <div className={`${submittedWords.length === 16 || mistakes == 5 ? "control-panel  sticky-footer" : "control-panel sticky-footer"}`}>
    {submittedWords.length === 16 || mistakes == 5 ?  <div className="control-panel">
          <button style={{marginBottom: '20px'}} className="btn btn-primary" onClick={handlePlayAgain}>Play Again</button>
        </div> : <div className="control-panel">
        <button className="btn btn-warning" onClick={handleShuffle}>Shuffle</button>
        <button className="btn btn-info" onClick={handleDeselectAll}>Deselect all</button>
        <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
      </div>}
      {submittedWords.length === 16 || mistakes == 5 ?
      <div></div> : <h1 className="mistakes">
      Mistakes remaining: {mapIcons.slice(0, 5 - mistakes)} </h1>}
      </div>
    </div>
    <RecordModal show={showRecordModal} onHide={() => setShowRecordModal(false)} />
    <WinModal show={showWinModal} onHide={() => setShowWinModal(false)} />
      <LossModal show={showLossModal} onHide={() => setShowLossModal(false)} />
      <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} />
      <Error2Modal show={showError2Modal} onHide={() => setShowError2Modal(false)} />
      <OneAwayModal show={showOneAwayModal} onHide={() => setShowOneAwayModal(false)} />
      <WrongModal show={showWrongModal} onHide={() => setShowWrongModal(false)} />
    </div>
  );
};

export default GameBoardState;
