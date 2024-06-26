import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFranchises } from '../store/allFranchisesStore';
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
import { createWin } from '../store/allWinsStore';
import { createLoss } from '../store/allLossesStore';
import RecordModal from './RecordModal';

const WordCard = ({ word, onSelect, isSelected, image }) => {
  const displayedWord = word.slice(0, -6);
  return (
    <div className={`word-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(word)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {image && <img src={image} alt={word} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />}
      <div>{displayedWord}</div>
    </div>
  );
};

const basketballIcons = Array.from({ length: 5 }, (_, index) => (
  <FontAwesomeIcon key={index} icon={faBasketballBall} style={{ marginRight: '5px' }} />
));

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
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [lossWords, setLossWords] = useState({});
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
    setShowHowToPlayModal(true);
  };



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
              category: 'Nba'
            };

            const updatedUser = {
              ...user,
              currentStreak: 0
            };

            setMistakes(5)

            // Update user streak in the database or through your API
            dispatch(updateSingleUser(updatedUser));
            // Dispatch the createLoss action
            dispatch(createLoss(loss));
          }

          const groupedWords = gameWords.reduce((acc, word) => {
            const franchiseName = allFranchises.find(franchise => franchise.players.some(player => player.name === word.name)).name;
            if (!acc[franchiseName]) {
              acc[franchiseName] = [];
            }
            acc[franchiseName].push(word.name);
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

        const handleOneAway = () => {
          setShowOneAwayModal(true);
        };

        const handleWrong = () => {
          setShowWrongModal(true);
        };

        const shuffleFranchisesAndPlayers = () => {
          const shuffledFranchises = [...allFranchises].sort(() => 0.5 - Math.random()).slice(0, 4);
          const selectedPlayers = shuffledFranchises.flatMap(franchise => {
            const shuffledPlayers = franchise.players.sort(() => 0.5 - Math.random());
            return shuffledPlayers.slice(0, 4);
          });

          const randomizedPlayers = selectedPlayers.sort(() => 0.5 - Math.random());

          setGameWords(randomizedPlayers.map(player => ({
            name: player.name,
            imagePath: player.imagePath
          })));
        };




        useEffect(() => {
          if (allFranchises.length > 0) {
            shuffleFranchisesAndPlayers();
          }
        }, [allFranchises]);

        useEffect(() => {
          if (submittedWords.length === 16) {
            handleWin();
          }
        }, [submittedWords]);

        const toggleSelectWord = (word) => {
          const newSelection = new Set(selectedWords);

          if (newSelection.has(word)) {
            newSelection.delete(word);
          } else {
            if (newSelection.size < 4) {
              newSelection.add(word);
            } else {
              handleError();
            }
          }
          setSelectedWords(newSelection);
        };

        const handlePlayAgain = () => {
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
          setShowConfetti(false);
          setLossWords({});
          shuffleFranchisesAndPlayers();
        };

        const handleSubmit = () => {
          if (selectedWords.size === 4) {
            const selectedWordArray = Array.from(selectedWords);

            const franchiseImages = [];
            const franchiseNames = [];
            const matchingFranchises = [];

            const isSameFranchise = allFranchises.some((franchise) => {
              const matchingPlayers = selectedWordArray.filter((playerName) =>
                franchise.players.some((player) => player.name === playerName)
              );

              if (matchingPlayers.length === 3) {
                matchingFranchises.push(franchise.name);
              }

              const allPlayerMatch = matchingPlayers.length === 4;

              if (allPlayerMatch) {
                franchiseImages.push(franchise.imagePath);
                franchiseNames.push(franchise.name);
              }

              return allPlayerMatch;
            });

            if (isSameFranchise) {
              const newSubmittedWords = [...submittedWords, ...selectedWordArray.map((playerName, idx) => ({ name: playerName, franchiseImagePath: franchiseImages[idx], franchiseNames: franchiseNames[idx] }))];
              setRow1(true);
              setSubmittedWords(newSubmittedWords);
              const images = [...picture];
              const answers = [...answer];

              images.push(franchiseImages);
              answers.push(franchiseNames);
              setPicture(images);
              setAnswer(answers);

              if (submittedWords.length === 4) {
                setRow2(true);
              }

              if (submittedWords.length === 8) {
                setRow3(true);
              }

              if (submittedWords.length === 12) {
                setRow4(true);
              }

              const remainingWords = gameWords.filter((player) => !selectedWords.has(player.name));

              setGameWords(remainingWords);
              setSelectedWords(new Set());
            } else {
              setMistakes((prev) => prev + 1);
              if (mistakes + 1 >= 5) {
                handleLoss();
              } else {
                if (matchingFranchises.length === 1) {
                  handleOneAway();
                } else {
                  handleWrong();
                }
                setSelectedWords(new Set());
              }
            }
          } else {
            handleError2();
          }
        };

        const handleShuffle = () => {
          setGameWords(gameWords.sort(() => 0.5 - Math.random()));
          setSelectedWords(new Set());
        };

        const handleDeselectAll = () => {
          setSelectedWords(new Set());
        };

        return (
          <div className="franchise-container">
            <div style={{ textAlign: 'center', margin: '20px' }}>
  <button onClick={handleShow} className="how-to-play-button">
                <h3 >How To Play</h3>
              </button>
            </div>
            <div className="confetti-container">
              {showConfetti && <Confetti />}
            </div>
            <Modal show={showHowToPlayModal} onHide={handleClose} className="custom-modal">
        <Modal.Header >
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

      {row1 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
            <h2 style={{ color: 'white' }}>1st: {answer[0]}</h2>
            <img src={picture[0]} alt="1st" className="picture-container" />
          </div>
          <div className='submitted-words first-row'>
            {submittedWords.slice(0, 4).map((word, index) => (
              <WordCard
                key={`submitted-${index}`}
                word={word.name}
                onSelect={() => { }}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      )}
      {row2 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
            <h2 style={{ color: 'white' }}>2nd: {answer[1]}</h2>
            <img src={picture[1]} alt="2nd" className="picture-container" />
          </div>
          <div className='submitted-words second-row'>
            {submittedWords.slice(4, 8).map((word, index) => (
              <WordCard
                key={`submitted-${index}`}
                word={word.name}
                onSelect={() => { }}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      )}
      {row3 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
            <h2 style={{ color: 'white' }}>3rd: {answer[2]}</h2>
            <img src={picture[2]} alt="3rd" className="picture-container" />
          </div>
          <div className='submitted-words third-row'>
            {submittedWords.slice(8, 12).map((word, index) => (
              <WordCard
                key={`submitted-${index}`}
                word={word.name}
                onSelect={() => { }}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      )}
      {row4 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
            <h2 style={{ color: 'white' }}>4th: {answer[3]}</h2>
            <img src={picture[3]} alt="4th" className="picture-container" />
          </div>
          <div className='submitted-words winner'>
            {submittedWords.slice(12, 16).map((word, index) => (
              <WordCard
                key={`submitted-${index}`}
                word={word.name}
                onSelect={() => { }}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        {mistakes !== 5 ? (
          <div className={`game-board ${gameWords.length === 12 ? 'adjusted' : ''}`}>
            {gameWords.map((player, index) => (
              <WordCard
                key={index}
                word={player.name}
                isSelected={selectedWords.has(player.name)}
                onSelect={toggleSelectWord}
                image={player.imagePath}
              />
            ))}
          </div>
        ) : (
          <div className="correct-answers-container">
          <h2>Correct Answers:</h2>
          <div className="correct-answers">
            {Object.keys(lossWords).map((franchise, index) => (
              <div key={index} className="answer-block">
                <h3>{franchise}:</h3>
                <ul>
                  {lossWords[franchise].map((player, idx) => (
                    <li key={idx}>{player}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        )}

        <div className={`${submittedWords.length === 16 || mistakes === 5 ? "control-panel sticky-footer" : "control-panel sticky-footer"}`}>
          {submittedWords.length === 16 || mistakes === 5 ? (
            <div className="control-panel">
            <div>
<Link to="/home" className="link-button">Home</Link>
</div>
<button className="styled-button" onClick={handlePlayAgain}>Play Again</button>
          </div>
          ) : (
            <div className="control-panel">
              <button className="btn btn-warning" onClick={handleShuffle}>Shuffle</button>
              <button className="btn btn-info" onClick={handleDeselectAll}>Deselect all</button>
              <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
            </div>
          )}
          <div className="mistake-and-giveup-container">
          {submittedWords.length === 16 || mistakes === 5 ? <div></div> : (
            <h1 className="mistakes">
              Mistakes remaining: {basketballIcons.slice(0, 5 - mistakes)}
            </h1>
          )}
       {submittedWords.length === 16 || mistakes == 5   ?  <div></div> : <button className="btn btn-danger give-up-button" onClick={handleLoss}>Give Up</button>}
          </div>
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

export default GameBoardNba;
