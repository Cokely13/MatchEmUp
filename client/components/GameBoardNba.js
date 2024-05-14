import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {fetchFranchises} from '../store/allFranchisesStore'
import { Button, Modal } from 'react-bootstrap';
import WinModal from './WinModal';
import LossModal from './LossModal';
import ErrorModal from './ErrorModal';
import Error2Modal from './Error2Modal';
import OneAwayModal from './OneAwayModal';
import WrongModal from './WrongModal';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';
import {createWin} from '../store/allWinsStore'
import {createLoss} from '../store/allLossesStore'

const WordCard = ({ word, onSelect, isSelected, image }) => {
  return (
    <div className={`word-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(word)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {image && <img src={image} alt={word} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />}
      <div>{word}</div>
    </div>
  );
};

const basketballIcons = Array.from({ length: 5 }, (_, index) => (
  <FontAwesomeIcon key={index} icon={faBasketballBall} style={{ marginRight: '5px' }} />
));




// Main game board component
const GameBoardNba = () => {
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
  const dispatch = useDispatch();
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showError2Modal, setShowError2Modal] = useState(false);
  const [showOneAwayModal, setShowOneAwayModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const userId = useSelector(state => state.auth);
  const user = useSelector(state => state.singleUser);
  const allFranchises = useSelector((state) => state.allFranchises);

  useEffect(() => {
    dispatch(fetchFranchises());
  }, []);

  useEffect(() => {
    dispatch(fetchSingleUser(userId.id));
  }, [dispatch, userId]);

  const handleClose = () => setShowHowToPlayModal(false);
  const handleShow = () => {
    setShowHowToPlayModal(true)}

    // const handleWin = () => {
    //   // Define the win object
    //   const win = {
    //     userId: userId.id, // assuming userId is obtained correctly from your auth state
    //     category: 'Nba' // category for this game board
    //   };

    //   const updatedUser = {
    //     ...user,
    //     currentStreak: user.currentStreak + 1,
    //     recordStreak: Math.max(user.recordStreak, user.currentStreak + 1)
    //   };

    //    // Update user streak in the database or through your API
    // dispatch(updateSingleUser(updatedUser));

    //   // Dispatch the createWin action
    //   dispatch(createWin(win));

    //   setShowWinModal(true);
    //   setShowConfetti(true);
    // };

    const handleWin = () => {
      if (userId && userId.id) { // Check if userId exists and has a valid id
        // Define the win object
        const win = {
          userId: userId.id,
          category: 'Nba'
        };

        const updatedUser = {
          ...user,
          currentStreak: user.currentStreak + 1,
          recordStreak: Math.max(user.recordStreak, user.currentStreak + 1)
        };

        if (updatedUser.currentStreak > user.recordStreak) {

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
          category: 'Nba'
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

  const shuffleFranchisesAndPlayers = () => {
    // Shuffle and pick the first 4 franchises
    const shuffledFranchises = [...allFranchises].sort(() => 0.5 - Math.random()).slice(0, 4);

    // Shuffle and pick 4 players from each of the 4 franchises
    const selectedPlayers = shuffledFranchises.flatMap(franchise => {
        const shuffledPlayers = franchise.players.sort(() => 0.5 - Math.random());
        return shuffledPlayers.slice(0, 4); // Make sure exactly 4 players are picked
    });

    // Further shuffle the combined list of players to randomize board layout
    const randomizedPlayers = selectedPlayers.sort(() => 0.5 - Math.random());

    // Update gameWords state with player names and images
    setGameWords(randomizedPlayers.map(player => ({
        name: player.name,
        imagePath: player.imagePath
    })));

};


  // Ensure this useEffect hook is called after your component is mounted and whenever allFranchises changes
  useEffect(() => {
    if (allFranchises.length > 0) {
      shuffleFranchisesAndPlayers();
    }
  }, [allFranchises]);



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
    shuffleFranchisesAndPlayers();
  };

  const handleSubmit = () => {
    if (selectedWords.size === 4) {
      const selectedWordArray = Array.from(selectedWords);

      const franchiseImages = [];
      const franchiseNames = [];
      const matchingFranchises = [];

      // Check if there is a quarterback that matches three out of four players
      const isSameFranchise = allFranchises.some((franchise) => {
        const matchingPlayers = selectedWordArray.filter((playerName) =>
          franchise.players.some((player) => player.name === playerName)
        );

        if (matchingPlayers.length === 3) {
          matchingFranchises.push(franchise.team);
        }

        const allPlayerMatch = matchingPlayers.length === 4;

        if (allPlayerMatch) {
          franchiseImages.push(franchise.imagePath)
          franchiseNames.push(franchise.team); // Capture the Franchise's image path when a match is found
        }

        return allPlayerMatch;
      });

      if (isSameFranchise) {
        // Correctly guessed all Players from the same Franchise
        const newSubmittedWords = [...submittedWords, ...selectedWordArray.map((playerName, idx) => ({ name: playerName, franchiseImagePath: franchiseImages[idx], franchiseNames: franchiseNames[idx] } ))];
        setRow1(true)
        setSubmittedWords(newSubmittedWords);
        const images = [...picture]
        const answers = [...answer]

        images.push(franchiseImages)
        answers.push(franchiseNames)
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

        // Remove correctly guessed Players from the game board
        const remainingWords = gameWords.filter((player) => !selectedWords.has(player.name));

        setGameWords(remainingWords);

        setSelectedWords(new Set()); // Clear the selections
      } else {
        // Incorrect guess, handle mistake
        setMistakes((prev) => prev + 1);
        if (mistakes + 1 >= 5) {
          handleLoss(); // Show loss modal
        } else {
          // Check if there is only one quarterback matching three out of four players
          if (matchingFranchises.length === 1) {
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
       <div className="franchise-container">
    <div style={{ textAlign: 'center', margin: '20px' }}>
        <Button variant="link" onClick={handleShow}>
          <h3 style={{ color: 'white' }}>How To Play</h3>
        </Button>
      </div>
      <div className="confetti-container">
  {showConfetti && <Confetti />}
</div>
      {/* How To Play Modal */}
      <Modal show={showHowToPlayModal} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>How To Play</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select 4 players from the same championship team.
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
          <h2 style={{ color: 'white' }}>1st: {answer[0]}</h2>
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
      // image={word.franchiseImagePath} Pass the Franchise's image path
    />
  ))}
</div></div>: <div></div>}
      {row2 ?     <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
      <h2 style={{ color: 'white' }}>2nd: {answer[1]}</h2>
      <img src={picture[1]} alt="1st" className="picture-container" />

    </div>
      <div className='submitted-words second-row'>
  {submittedWords.slice(4, 8).map((word, index) => (
    <WordCard
      key={`submitted-${index}`}
      word={word.name}
      onSelect={() => {}}
      isSelected={false}
      // image={word.franchiseImagePath} Pass the Franchise's image path
    />
  ))}</div></div>: <div></div>}
       {row3 ?   <div> <div style={{ display: 'flex', flexDirection: 'column',  alignItems: 'center', margin: '10px 0' }}>
      <h2 style={{ color: 'white' }}>3rd: {answer[2]}</h2>
      <img src={picture[2]} alt="1st" className="picture-container" />
    </div>  <div className='submitted-words third-row'>
  {submittedWords.slice(8, 12).map((word, index) => (
    <WordCard
      key={`submitted-${index}`}
      word={word.name}
      onSelect={() => {}}
      isSelected={false}
       // image={word.franchiseImagePath} Pass the Franchise's image path
    />
  ))}</div></div>: <div></div>}

       {row4 ?  <div>
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
       <h2 style={{ color: 'white' }}>4th: {answer[3]}</h2>
       <img src={picture[3]} alt="1st" className="picture-container" />
     </div>
          <div className='submitted-words winner'>
  {submittedWords.slice(12, 16).map((word, index) => (
    <WordCard
      key={`submitted-${index}`}
      word={word.name}
      onSelect={() => {}}
      isSelected={false}
      // image={word.franchiseImagePath} Pass the Franchise's image path
    />
  ))}</div></div>: <div></div>}
<div>


    <div className={`game-board ${gameWords.length === 12 ? 'adjusted' : ''}`}>
  {gameWords.map((player, index) => (
    <WordCard
      key={index}
      word={player.name}
      isSelected={selectedWords.has(player.name)}
      onSelect={toggleSelectWord}
      image={player.imagePath} // Pass the image path here
    />
  ))}
</div>

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
      Mistakes remaining: {basketballIcons.slice(0, 5 - mistakes)} </h1>}
      </div>
    </div>
    <WinModal show={showWinModal} onHide={() => setShowWinModal(false)} />
      <LossModal show={showLossModal} onHide={() => setShowLossModal(false)} />
      <ErrorModal show={showErrorModal} onHide={() => setShowErrorModal(false)} />
      <Error2Modal show={showError2Modal} onHide={() => setShowError2Modal(false)} />
      <OneAwayModal show={showOneAwayModal} onHide={() => setShowOneAwayModal(false)} />
      <WrongModal show={showWrongModal} onHide={() => setShowWrongModal(false)} />
    </div>
  );
};

export default GameBoardNba;
