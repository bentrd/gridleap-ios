import * as React from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Ad } from '../views/HomeScreen';
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';

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
                fontSize: 40,
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
        }
    }

    const gameOver = () => {
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (grid[i][j].status == 'taken') setTile(i, j, 'lost');
            }
        }
        setTimeout(() => setPlaying(false), 500);
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
                            <Text style={styles.score, { fontSize: 25 }}>25</Text>
                        </View>
                        <CustomButton style={{ width: '90%', marginBottom: 5 }} onPress={() => reset()}>
                            <Text style={styles.popupbuttons}>play again</Text>
                        </CustomButton>
                        <CustomButton style={{ width: '90%' }} onPress={() => navigation.navigate('home')}>
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
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', height: 75, marginBottom: 20 }}>
                    <CustomButton onPress={() => navigation.navigate('home')}>
                        <Icon name='chevron-left' type='feather' size={30} />
                    </CustomButton>
                    <CustomButton onPress={() => reset()}>
                        <Icon name='rotate-ccw' type='feather' />
                    </CustomButton>
                </View>
                <View style={styles.grid}>{rows}</View>
                <PlayAgainPopUp />
            </>
        )
    }

    React.useEffect(() => {
        reset();
    }, [])

    return (
        createGrid()
    );
}

export default Game = (props) => {
    return (
        <SafeAreaView style={styles.main}>
            <Title />
            <View style={styles.spacer} />
            <Grid size={props.size} />
            <View style={styles.spacer} />
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
        fontSize: 100,
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
        width: 75,
        height: 50,
        borderRadius: 15,
        margin: 20,
        shadowColor: '#bbb',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 0,
        shadowOpacity: 1
    },
    spacer: {
        height: '15%'
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
        height: 0.75 * Dimensions.get('window').width,
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
