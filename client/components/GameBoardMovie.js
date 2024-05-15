import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActors } from '../store/allActorsStore';
import { createWin } from '../store/allWinsStore';
import { createLoss } from '../store/allLossesStore';
import { Button, Modal } from 'react-bootstrap';
import WinModal from './WinModal';
import RecordModal from './RecordModal';
import LossModal from './LossModal';
import ErrorModal from './ErrorModal';
import Error2Modal from './Error2Modal';
import OneAwayModal from './OneAwayModal';
import WrongModal from './WrongModal';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';

const WordCard = ({ word, onSelect, isSelected, image }) => {
  return (
    <div className={`word-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(word)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {image && <img src={image} alt={word} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />}
      <div>{word}</div>
    </div>
  );
}

const movieIcons = Array.from({ length: 5 }, (_, index) => (
  <FontAwesomeIcon key={index} icon={faFilm} style={{ marginRight: '5px' }} />
));

const GameBoardMovie = () => {
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
  const dispatch = useDispatch();
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showError2Modal, setShowError2Modal] = useState(false);
  const [showOneAwayModal, setShowOneAwayModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const userId = useSelector(state => state.auth);
  const user = useSelector(state => state.singleUser);
  const allActors = useSelector((state) => state.allActors);

  useEffect(() => {
    dispatch(fetchSingleUser(userId.id));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchActors());
  }, []);

  const handleClose = () => setShowHowToPlayModal(false);
  const handleShow = () => {
    setShowHowToPlayModal(true);
  };

  const handleWin = () => {
    if (userId && userId.id) {
      const win = {
        userId: userId.id,
        category: 'Movies'
      };

      const updatedUser = {
        ...user,
        currentStreak: user.currentStreak + 1,
        recordStreak: Math.max(user.recordStreak, user.currentStreak + 1)
      };

      if (updatedUser.currentStreak > user.recordStreak) {
        setShowRecordModal(true);
      }

      dispatch(updateSingleUser(updatedUser));
      dispatch(createWin(win));
    }

    setShowWinModal(true);
    setShowConfetti(true);
  };

  const handleLoss = () => {
    if (userId && userId.id) {
      const loss = {
        userId: userId.id,
        category: 'Movies'
      };

      const updatedUser = {
        ...user,
        currentStreak: 0
      };

      dispatch(updateSingleUser(updatedUser));
      dispatch(createLoss(loss));
    }

    const groupedWords = gameWords.reduce((acc, word) => {
      const actorName = allActors.find(actor => actor.movies.some(movie => movie.name === word.name)).name;
      if (!acc[actorName]) {
        acc[actorName] = [];
      }
      acc[actorName].push(word.name);
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

  const shuffleActorsAndMovies = () => {
    const shuffledActors = [...allActors].sort(() => 0.5 - Math.random());
    const selectedActors = shuffledActors.slice(0, 4);
    const selectedMovies = selectedActors.flatMap(actor =>
      actor.movies.sort(() => 0.5 - Math.random()).slice(0, 4)
    ).sort(() => 0.5 - Math.random());

    setGameWords(selectedMovies.map(movie => ({
      name: movie.name,
      imagePath: movie.imagePath
    })));
  };

  useEffect(() => {
    if (allActors.length > 0) {
      shuffleActorsAndMovies();
    }
  }, [allActors]);

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
    shuffleActorsAndMovies();
  };

  const handleSubmit = () => {
    if (selectedWords.size === 4) {
      const selectedWordArray = Array.from(selectedWords);

      const actorImages = [];
      const actorNames = [];
      const matchingActors = [];

      const isSameActor = allActors.some((actor) => {
        const matchingMovies = selectedWordArray.filter((movieName) =>
          actor.movies.some((movie) => movie.name === movieName)
        );

        if (matchingMovies.length === 3) {
          matchingActors.push(actor.name);
        }

        const allMovieMatch = matchingMovies.length === 4;

        if (allMovieMatch) {
          actorImages.push(actor.imagePath);
          actorNames.push(actor.name);
        }

        return allMovieMatch;
      });

      if (isSameActor) {
        const newSubmittedWords = [...submittedWords, ...selectedWordArray.map((movieName, idx) => ({ name: movieName, actorImagePath: actorImages[idx], actorName: actorNames[idx] }))];
        setRow1(true);
        setSubmittedWords(newSubmittedWords);
        const images = [...picture];
        const answers = [...answer];

        images.push(actorImages);
        answers.push(actorNames);
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

        const remainingWords = gameWords.filter((movie) => !selectedWords.has(movie.name));

        setGameWords(remainingWords);
        setSelectedWords(new Set());
      } else {
        setMistakes((prev) => prev + 1);
        if (mistakes + 1 >= 5) {
          handleLoss();
        } else {
          if (matchingActors.length === 1) {
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
    <div className="app-container">
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <Button variant="link" onClick={handleShow} style={{ color: 'white' }}>
          <h3>How To Play</h3>
        </Button>
      </div>
      <div className="confetti-container">
        {showConfetti && <Confetti />}
      </div>
      <Modal show={showHowToPlayModal} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>How To Play!!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select 4 Movies from the same actor.
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
            {gameWords.map((word, index) => (
              <WordCard
                key={index}
                word={word.name}
                isSelected={selectedWords.has(word.name)}
                onSelect={toggleSelectWord}
                image={word.imagePath}
              />
            ))}
          </div>
        ) : (
          <div>
            <h2>Correct Answers:</h2>
            <div className='correctAnswers'>
              {Object.keys(lossWords).map((actor, index) => (
                <div key={index}>
                  <h3>{actor}:</h3>
                  <ul>
                    {lossWords[actor].map((movie, idx) => (
                      <li key={idx}>{movie}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`${submittedWords.length === 16 || mistakes === 5 ? "control-panel sticky-footer" : "control-panel sticky-footer"}`}>
          {submittedWords.length === 16 || mistakes === 5 ? (
            <div>
              <div><Link to="/home" style={{ color: 'white' }}>Home</Link></div>
              <div className="control-panel">
                <button style={{ marginBottom: '20px' }} className="btn btn-primary" onClick={handlePlayAgain}>Play Again</button>
              </div>
            </div>
          ) : (
            <div className="control-panel">
              <button className="btn btn-warning" onClick={handleShuffle}>Shuffle</button>
              <button className="btn btn-info" onClick={handleDeselectAll}>Deselect all</button>
              <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
            </div>
          )}
          {submittedWords.length === 16 || mistakes === 5 ? <div></div> : (
            <h1 className="mistakes">
              Mistakes remaining: {movieIcons.slice(0, 5 - mistakes)}
            </h1>
          )}
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

export default GameBoardMovie;
