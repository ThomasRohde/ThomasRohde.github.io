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
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

let theme = createTheme({
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
theme = responsiveFontSizes(theme);

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
        }, 300);
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
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="flex-start" 
        minHeight="100vh" 
        bgcolor={grey[100]}
        px={2}
        py={3}
      >
        <Typography variant="h3" component="h1" mb={2}>
          WORDLE
        </Typography>
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center"
          flexGrow={1}
          width="100%"
          maxWidth="100vw"
          mb={4}
        >
          <Box mb={2} width="100%" maxWidth="min(80vh, 90vw)" display="flex" flexDirection="column" alignItems="center">
            {attempts.map((attempt, attemptIndex) => (
              <Box key={attemptIndex} display="flex" justifyContent="center" mb={0.5} width="100%">
                {Array(WORD_LENGTH).fill().map((_, letterIndex) => (
                  <Box
                    key={letterIndex}
                    width="18%"
                    height={0}
                    paddingBottom="18%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={{ xs: '1rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' }}
                    fontWeight="bold"
                    border={1}
                    borderColor={grey[300]}
                    bgcolor={getLetterColor(attempt[letterIndex], letterIndex, attemptIndex)}
                    color={getLetterTextColor(attempt[letterIndex], letterIndex, attemptIndex)}
                    mx="1%"
                    position="relative"
                    style={{
                      transition: 'all 0.3s',
                      transitionDelay: `${letterIndex * 300}ms`,
                      transform: attemptIndex === currentAttempt && letterIndex <= revealIndices[attemptIndex] ? 'rotateX(180deg)' : 'rotateX(0deg)'
                    }}
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      style={{
                        transform: attemptIndex === currentAttempt && letterIndex <= revealIndices[attemptIndex] ? 'rotateX(180deg)' : 'rotateX(0deg)'
                      }}
                    >
                      {attempt[letterIndex] || ''}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
        <Box width="100%" maxWidth="min(80vh, 90vw)" mb={4}>
          {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <Box key={rowIndex} display="flex" justifyContent="center" mb={0.5}>
              {row.map((key) => (
                <Button
                  key={key}
                  variant="contained"
                  onClick={() => handleKeyPress(key)}
                  disabled={isAnimating}
                  sx={{
                    minWidth: 0,
                    width: key.length > 1 ? '20%' : '9%',
                    height: { xs: 40, sm: 58, md: 66, lg: 72 },
                    mx: '0.5%',
                    p: 0,
                    fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem', lg: '1.2rem' },
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
        <Box flexGrow={1} />
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