import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { green, grey, yellow } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [attempts, setAttempts] = useState(Array(MAX_ATTEMPTS).fill(''));
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [keyboardColors, setKeyboardColors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [revealIndices, setRevealIndices] = useState(Array(MAX_ATTEMPTS).fill(-1));
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchNewWord();
  }, []);

  const fetchNewWord = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${WORD_LENGTH}`);
      const data = await response.json();
      setTargetWord(data[0].toUpperCase());
      console.log(data[0].toUpperCase());
    } catch (error) {
      console.error('Failed to fetch word:', error);
      setAlertMessage('Failed to fetch a new word. Please try again.');
      setShowAlert(true);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (key) => {
    if (gameOver || isLoading || isAnimating) return;
    
    if (key === '⌫') {
      setAttempts(prev => {
        const newAttempts = [...prev];
        newAttempts[currentAttempt] = newAttempts[currentAttempt].slice(0, -1);
        return newAttempts;
      });
    } else if (key === 'ENTER') {
      if (attempts[currentAttempt].length === WORD_LENGTH) {
        checkAttempt();
      } else {
        setAlertMessage("Not enough letters");
        setShowAlert(true);
      }
    } else if (attempts[currentAttempt].length < WORD_LENGTH) {
      setAttempts(prev => {
        const newAttempts = [...prev];
        newAttempts[currentAttempt] += key;
        return newAttempts;
      });
    }
  };

  const checkAttempt = () => {
    const currentWord = attempts[currentAttempt];
    setIsAnimating(true);
    let index = 0;
    const revealInterval = setInterval(() => {
      setRevealIndices(prev => {
        const newIndices = [...prev];
        newIndices[currentAttempt] = index;
        return newIndices;
      });
      index++;
      if (index === WORD_LENGTH) {
        clearInterval(revealInterval);
        setTimeout(() => {
          if (currentWord === targetWord) {
            setGameWon(true);
            setGameOver(true);
          } else if (currentAttempt === MAX_ATTEMPTS - 1) {
            setGameOver(true);
          } else {
            setCurrentAttempt(prev => prev + 1);
          }
          updateKeyboardColors(currentWord);
          setIsAnimating(false);
        }, 300); // Delay to allow the last tile to flip
      }
    }, 300);
  };

  const updateKeyboardColors = (word) => {
    const newColors = { ...keyboardColors };
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      if (letter === targetWord[i]) {
        newColors[letter] = green[500];
      } else if (targetWord.includes(letter) && newColors[letter] !== green[500]) {
        newColors[letter] = yellow[700];
      } else if (!newColors[letter]) {
        newColors[letter] = grey[500];
      }
    }
    setKeyboardColors(newColors);
  };

  const getLetterColor = (letter, index, attempt) => {
    if (attempt > currentAttempt || (attempt === currentAttempt && index > revealIndices[attempt])) return grey[200];
    if (letter === targetWord[index]) return green[500];
    if (targetWord.includes(letter)) return yellow[700];
    return grey[500];
  };

  const getLetterTextColor = (letter, index, attempt) => {
    const bgColor = getLetterColor(letter, index, attempt);
    return bgColor === grey[200] ? 'black' : 'white';
  };

  const resetGame = () => {
    setAttempts(Array(MAX_ATTEMPTS).fill(''));
    setCurrentAttempt(0);
    setGameOver(false);
    setGameWon(false);
    setKeyboardColors({});
    setRevealIndices(Array(MAX_ATTEMPTS).fill(-1));
    fetchNewWord();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor={grey[100]}>
        <Typography variant="h3" component="h1" gutterBottom>
          WORDLE
        </Typography>
        <Box mb={4}>
          {attempts.map((attempt, attemptIndex) => (
            <Box key={attemptIndex} display="flex" justifyContent="center" mb={1}>
              {Array(WORD_LENGTH).fill().map((_, letterIndex) => (
                <Box
                  key={letterIndex}
                  width={56}
                  height={56}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize={24}
                  fontWeight="bold"
                  border={1}
                  borderColor={grey[300]}
                  bgcolor={getLetterColor(attempt[letterIndex], letterIndex, attemptIndex)}
                  color={getLetterTextColor(attempt[letterIndex], letterIndex, attemptIndex)}
                  mx={0.5}
                  style={{
                    transition: 'all 0.3s',
                    transitionDelay: `${letterIndex * 300}ms`,
                    transform: attemptIndex === currentAttempt && letterIndex <= revealIndices[attemptIndex] ? 'rotateX(180deg)' : 'rotateX(0deg)'
                  }}
                >
                  <span style={{transform: attemptIndex === currentAttempt && letterIndex <= revealIndices[attemptIndex] ? 'rotateX(180deg)' : 'rotateX(0deg)'}}>
                    {attempt[letterIndex] || ''}
                  </span>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box width="100%" maxWidth={500}>
          {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <Box key={rowIndex} display="flex" justifyContent="center" mb={1}>
              {row.map((key) => (
                <Button
                  key={key}
                  variant="contained"
                  onClick={() => handleKeyPress(key)}
                  disabled={isAnimating}
                  sx={{
                    minWidth: key.length > 1 ? 66 : 40,
                    height: 58,
                    mx: 0.5,
                    bgcolor: keyboardColors[key] || grey[300],
                    color: keyboardColors[key] ? 'white' : 'black',
                    '&:hover': {
                      bgcolor: keyboardColors[key] ? keyboardColors[key] : grey[400],
                    },
                  }}
                >
                  {key}
                </Button>
              ))}
            </Box>
          ))}
        </Box>
        <Dialog open={gameOver} onClose={resetGame}>
          <DialogTitle>{gameWon ? 'Congratulations!' : 'Game Over'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {gameWon 
                ? `You guessed the word: ${targetWord}`
                : `The word was: ${targetWord}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetGame} color="primary">
              Play Again
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showAlert} onClose={() => setShowAlert(false)}>
          <DialogTitle>Notice</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {alertMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAlert(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default WordleGame;