import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, Platform, ImageBackground } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from './src/constants';
import Keyboard from './src/components/Keyboard';
import * as Clipboard from 'expo-clipboard'; 
import { fiveLetterWord } from './Data';

const NUMBER_OF_TRIES = 6;
const copyArr = (arr) => {
  return [...arr.map((item) => [ ...item ])];
};

// Function to generate random number  to use to index word array

export default function App() {
  const word = fiveLetterWord.toLowerCase();
  // const word = "hello";
  const letters = word.split('');
  console.log(word, "word")

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')))
  const [curRow, setCurRow] = useState(0)
  const [curCol, setCurCol] = useState(0)
  const [gameState, setGameState] = useState('playing');

  useEffect(() => {
    if (curRow > 0) {
      checkGameStatus();
    }
  }, [curRow])


  const checkGameStatus = () => {
    if(checkIfWon() && gameState !== 'won') {
      // Alert.alert("Horray! you have won!", [{text: "Share", onPress: () => console.log("share your results")}])
      Alert.alert('Horray! you have won!', 'Share your results 😊', [
        { text: 'Share', onPress: shareScore },
      ]);
      setGameState('won');
      resetGame();

    }else if (checkIfLost() ) {
      // Alert.alert("Sorry! you have lost!", `The word was ${word}`)
      Alert.alert('Sorry! you have lost!', `The word was ${word}`, [
        { text: 'Play again', onPress: resetGame },
      ]);
      setGameState('lost');
      resetGame();
    }
  }
  const checkIfWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, index) => letter === letters[index])
  }
  const checkIfLost = () => {
    return curRow === NUMBER_OF_TRIES;
  }
  const handleKeyPress = (letter) => {
    if (gameState !== 'playing') {
      return;
    }
    const updatedRow = copyArr(rows);

    if (letter === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRow[curRow][prevCol] = '';
        setCurCol(prevCol);
        setRows(updatedRow);
        
      }
      return;
    }


    if (letter === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }
      


    if (curCol < rows[0].length) {
      updatedRow[curRow][curCol] = letter;
      setRows(updatedRow);
      setCurCol(curCol + 1);
    }
    // console.warn(letter);

  }
  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  } 

  const resetGame = () => {
    setRows(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')))
    setCurRow(0)
    setCurCol(0)
    setGameState('playing');
  }

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) {
      return colors.black
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey
  }


  const getAllLetterWithColors = (color) => {
    return rows.flatMap((row, i) => (
      row.filter((cell, j) => getCellBGColor(i, j) ===color)
    ))
  }

  const shareScore = async() => {
    const textShare = rows.map((row, i) => row.map((cell, j) => colorsToEmoji[getCellBGColor(i,j)]).join("")).filter(row => row).join("\n");

    await Clipboard.setStringAsync(`My todays word \n \n${textShare}`);
    Alert.alert("Copied to clipboard", textShare);
  }
  const greenCaps = getAllLetterWithColors(colors.primary)
  const yellowCaps = getAllLetterWithColors(colors.secondary)
  const greyCaps = getAllLetterWithColors(colors.darkgrey) 

  console.log(greyCaps, "view gray caps")
  return (
    <ImageBackground source={require('./assets/background2.jpeg')} style={styles.container}>
      <SafeAreaView style={styles.container}>
      <StatusBar style="light" />


      <Text style={styles.title}>
        Play
      </Text>
      <Text style={{ color: colors.black, fontSize: 20 }}>
        Guess a 5 letter verb
      </Text>
      <View style={styles.map}>
      {rows.map((row, i) => (
        <View style={styles.row} key={`row-${i}`}>
        {row.map((letter, j) => (
          <View key={`cell-${i}-${j}`}
            style={
              [
                styles.cell, 
                {
                  borderColor: isCellActive(i,j) ? colors.lightgrey : colors.darkgrey,
                  backgroundColor: getCellBGColor(i,j )}] }>
            <Text style={styles.cellText}>
              {letter.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
      ))}
      </View>

      <Keyboard
        onKeyPressed={handleKeyPress}
        greenCaps={greenCaps} 
        yellowCaps={yellowCaps} 
        greyCaps={greyCaps}
        />
    </SafeAreaView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    })
  },
  title: {
    color: colors.black,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
    // paddingTop: Platform
  },
  map: {
    // maxWidth: '0%',
    display: 'flex',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cell: {
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    borderColor: colors.darkgrey,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    
  },
  cellText: {
    fontWeight: 'bold',
    fontSize : 28,
    color: colors.lightgrey,
  }
});
