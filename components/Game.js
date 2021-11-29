import * as React from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Ad } from '../views/HomeScreen';
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData } from './Menu';
import Player from '../Player';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Spacer from './Spacer';

const CustomButton = (props) => {
    return (
        <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed
                        ? 'wheat'
                        : '#eee'
                },
                styles.button,
                props.style
            ]}>
            {props.children}
        </Pressable>
    );
}

const Tile = (props) => {
    var status = props.status;
    var value = props.value;

    const bgMap = {
        'possible': 'wheat',
        'taken': 'white',
        'free': '#bbb',
        'lost': '#333'
    }

    return (
        <Pressable
            onPress={props.onPress}
            style={[
                styles.tile,
                {
                    backgroundColor: bgMap[status],
                    width: 0.7 * Dimensions.get('window').width / props.size,
                    height: 0.7 * Dimensions.get('window').width / props.size
                },
            ]}>
            <Text style={{
                fontSize: RFPercentage(5),
                color: (status == 'lost') ? 'wheat' : 'black'
            }}>{value}</Text>
        </Pressable>
    );
}

const Grid = (props) => {
    const navigation = useNavigation();
    const size = props.size;
    const [currNum, setCurrNum] = React.useState(1);
    const [playing, setPlaying] = React.useState(true);
    const [highscores, setHighscores] = React.useState({});
    const [grid, setGrid] = React.useState(() => {
        var grid = [];
        for (var i = 0; i < size; i++) {
            grid[i] = [];
            for (var j = 0; j < size; j++) {
                grid[i][j] = { status: 'possible', value: 1 };
            }
        }
        return grid;
    });

    React.useEffect(() => {
        reset();
    }, []);

    React.useEffect(() => getHighscores(), []);

    const getHighscores = async () => {
        try {
            var highscores = { 5: '', 6: '', 7: '' };
            for (var i = 5; i <= 7; i++) {
                const value = await AsyncStorage.getItem(`@highscore-${i}`);
                if (value !== null) highscores[i] = value;
                else highscores[i] = '0';
            }
            setHighscores(highscores);
        } catch (e) {
        }
    }

    const reset = () => {
        var g = [];
        for (var i = 0; i < size; i++) {
            g[i] = [];
            for (var j = 0; j < size; j++) {
                g[i][j] = { status: 'possible', value: 1 };
            }
        }
        setGrid(g);
        setCurrNum(1);
        setPlaying(true);
    }

    const deletePossible = () => {
        var g = grid.slice();
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (g[i][j].status == 'possible') {
                    g[i][j].status = 'free';
                    g[i][j].value = '';
                }
            }
        }
        setGrid(g);
    }

    const showPossible = (i, j) => {
        const neighbors = [0, 3, 3, 0, 0, -3, -3, 0, -2, 2, 2, 2, 2, -2, -2, -2];
        var count = 0;
        for (var k = 0; k < 16;) {
            var x = i + neighbors[k++],
                y = j + neighbors[k++]
            if (x < 0 || y < 0 || x >= size || y >= size) continue;
            if (grid[x][y].status != 'free') continue;
            setTile(x, y, 'possible', currNum + 1);
            count++;
        }
        if (count == 0) gameOver();
    }

    const setTile = (i, j, status, value) => {
        var g = grid.slice();
        if (typeof status !== 'undefined') g[i][j].status = status;
        if (typeof value !== 'undefined') g[i][j].value = value;
        setGrid(g);
    }

    const next = (i, j) => {
        if (grid[i][j].status == 'possible') {
            setTile(i, j, 'taken', currNum);
            setCurrNum(currNum + 1);
            deletePossible();
            showPossible(i, j);
            Player.playSound('pop');
        }
    }


    const gameOver = () => {
        if (currNum == size * size) Player.playSound('win');
        else {
            Player.playSound('lost');
            for (var i = 0; i < size; i++) {
                for (var j = 0; j < size; j++) {
                    if (grid[i][j].status == 'taken') setTile(i, j, 'lost');
                }
            }
        }
        if (Number(highscores[size]) < currNum || currNum == size * size) {
            if (currNum == size * size) storeData(`@highscore-${size}`, String(size * size));
            else storeData(`@highscore-${size}`, String(currNum));
            getHighscores();
        }
        setTimeout(() => setPlaying(false), 1000);
    }

    const createRow = (i) => {
        var tiles = [...Array(size).keys()].map((j) => {
            return <Tile key={`${i}:${j}`} size={size} status={grid[i][j].status} value={grid[i][j].value} onPress={() => next(i, j)} />
        });
        return <View key={`${i}:`} style={styles.row}>{tiles}</View>
    }

    const PlayAgainPopUp = () => {
        if (!playing) {
            return (
                <View style={styles.popupwrap}>
                    <View style={styles.popup}>
                        <Pressable onPress={() => setPlaying(true)} style={{ alignSelf: 'flex-end', padding: 0, margin: 0 }}><Icon name='x' type='feather' /></Pressable>
                        <View style={styles.scorewrap}>
                            <Text style={styles.yourscore}>SCORE:</Text>
                            <Text style={styles.score}>{currNum - 1}</Text>
                        </View>
                        <View style={styles.bestscorewrap}>
                            <Text style={styles.yourscore, { fontSize: 20 }}>BEST:</Text>
                            <Text style={styles.score, { fontSize: 25 }}>{highscores[size]}</Text>
                        </View>
                        <CustomButton style={{ width: '90%', marginBottom: 5 }} onPress={() => {
                            reset();
                        }}>
                            <Text style={styles.popupbuttons}>play again</Text>
                        </CustomButton>
                        <CustomButton style={{ width: '90%' }} onPress={() => {
                            navigation.navigate('home');
                            Player.playSound('click');
                        }}>
                            <Text style={styles.popupbuttons}>menu</Text>
                        </CustomButton>
                    </View>
                </View>)
        } else return <></>
    }

    const createGrid = () => {
        var rows = [...Array(size).keys()].map((i) => {
            return createRow(i);
        });
        return (
            <>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: eval(0.8 * Dimensions.get('window').width), marginBottom: 20 }}>
                    <CustomButton onPress={() => {
                        navigation.navigate('home');
                        Player.playSound('click');
                    }}>
                        <Icon name='chevron-left' type='feather' size={RFPercentage(5)} />
                    </CustomButton>
                    <CustomButton onPress={() => {
                        reset();
                        Player.playSound('click');
                    }}>
                        <Icon name='rotate-ccw' type='feather' size={RFPercentage(4)} />
                    </CustomButton>
                </View>
                <View style={styles.grid}>{rows}</View>
                <PlayAgainPopUp />
            </>
        )
    }

    return (
        createGrid()
    );
}

export default Game = (props) => {
    return (
        <SafeAreaView style={styles.main}>
            <Title />
            <Spacer size={5} />
            <Grid size={props.size} />
            <Ad id='ca-app-pub-5015586611437235/3396584913' />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#242424'
    },
    title: {
        fontFamily: 'Questrial',
        fontSize: RFPercentage(13),
        color: 'wheat',
        textAlign: 'center',
        transform: [{ translateY: 20 }]
    },
    tile: {
        backgroundColor: '#bbb',
        margin: 5,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        backgroundColor: '#555',
        borderRadius: 20,
        padding: 5
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: RFPercentage(7),
        height: RFPercentage(7),
        borderRadius: 15,
        margin: 20,
        shadowColor: '#bbb',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 0,
        shadowOpacity: 1
    },
    popupwrap: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000066',
    },
    popup: {
        width: 0.7 * Dimensions.get('window').width,
        backgroundColor: 'white',
        borderRadius: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10
    },
    scorewrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    yourscore: {
        fontFamily: 'Questrial',
        fontSize: 30,
        color: '#666'
    },
    score: {
        fontFamily: 'Questrial',
        fontSize: 50,
        color: '#242424',
        margin: 10
    },
    bestscorewrap: {
        width: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#f5deb3aa',
        borderRadius: 10
    },
    popupbuttons: {
        fontSize: 30
    }
});
