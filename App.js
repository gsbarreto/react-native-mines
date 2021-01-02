import React, {useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';

import params from './src/params';
import MineField from './src/components/MineField';
import Header from './src/components/Header';
import LevelSelection from './src/screens/LevelSelection';

import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExploded,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from './src/functions';

const minesAmount = () => {
  const cols = params.getColumnsAmount();
  const rows = params.getRowsAmount();

  return Math.ceil(cols * rows * params.difficultLevel);
};

const createState = () => {
  const cols = params.getColumnsAmount();
  const rows = params.getRowsAmount();

  return createMinedBoard(rows, cols, minesAmount());
};

const App = () => {
  const [board, setBoard] = useState(createState());
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [showLevelSelection, setShowLevelSelection] = useState(false);

  const openFieldCallback = (row, column) => {
    const boardCloned = cloneBoard(board);
    openField(boardCloned, row, column);
    const hasLost = hadExploded(boardCloned);
    const hasWon = wonGame(boardCloned);
    if (hasLost) {
      showMines(boardCloned);
      Alert.alert('Peeerrrdddeeuuuuu!!!', 'Não foi dessa vez!');
    }
    if (hasWon) {
      showMines(boardCloned);
      Alert.alert('Parabéns!!!', 'Você venceu!');
    }

    setBoard(boardCloned);
    setWon(hasWon);
    setLost(hasLost);
  };

  const onSelectField = (row, column) => {
    const boardClone = cloneBoard(board);
    invertFlag(boardClone, row, column);
    const hasWon = wonGame(boardClone);
    if (hasWon) {
      showMines(boardCloned);
      Alert.alert('Parabéns!!!', 'Você venceu!');
    }

    setBoard(boardClone);
    setWon(hasWon);
  };

  const onLevelSelected = (level) => {
    params.difficultLevel = level;
    setBoard(createState());
    setShowLevelSelection(false);
  };

  return (
    <View style={styles.container}>
      <LevelSelection
        isVisible={showLevelSelection}
        onLevelSelected={onLevelSelected}
        onCancel={() => setShowLevelSelection(false)}
      />
      <Header
        flagsLeft={minesAmount() - flagsUsed(board)}
        onNewGame={() => setBoard(createState())}
        onFlagPress={() => setShowLevelSelection(true)}
      />
      <View style={styles.board}>
        <MineField
          board={board}
          onOpenField={openFieldCallback}
          onSelectField={onSelectField}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA',
  },
});

export default App;
