import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from './src/constants';
import Keyboard from './src/components/Keyboard';
import * as Clipboard from 'expo-clipboard'; 

const NUMBER_OF_TRIES = 6;
const copyArr = (arr) => {
  return [...arr.map((item) => [ ...item ])];
};

export default function App() {
  const word = "hello";
  const letters = word.split('');

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
    }else if (checkIfLost() ) {
      Alert.alert("Sorry! you have lost!")
      setGameState('lost');
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

    await Clipboard.setStringAsync(`My todays wordle \n \n${textShare}`);
    Alert.alert("Copied to clipboard", textShare);
  }
  const greenCaps = getAllLetterWithColors(colors.primary)
  const yellowCaps = getAllLetterWithColors(colors.secondary)
  const greyCaps = getAllLetterWithColors(colors.darkgrey) 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />


      <Text style={styles.title}>
        WORDLE
      </Text>
      <ScrollView style={styles.map}>
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
      </ScrollView>

      <Keyboard
        onKeyPressed={handleKeyPress}
        greenCaps={greenCaps} 
        yellowCaps={yellowCaps} 
        greyCaps={greyCaps}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7
  },
  map: {
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
    margin: 3
  },
  cellText: {
    fontWeight: 'bold',
    fontSize : 28,
    color: colors.lightgrey,
  }
});
