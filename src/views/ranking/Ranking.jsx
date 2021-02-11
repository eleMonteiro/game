import React, { Component } from "react";
import { Text, Image, View, StyleSheet, Button } from "react-native";

import { BackHandler } from 'react-native';

import * as firebase from '../../api/firebase'

export default class Ranking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: this.props.route.params.players,
            elementos: []
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        const obj = this.props.route.params.players
        var elementos = []

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                elementos.push(obj[i])
            }
        }

        elementos.sort(function (a, b) { return b['pontuacao'] - a['pontuacao'] })

        this.setState({ elementos: elementos })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }
    


    render() {
        const { elementos } = this.state

        return (
            <View style={styles.container}>

                <View style={styles.containerIMG}>
                    <Image source={require('./ranking.png')} style={styles.imagem} />
                    <Text style={styles.textRanking}>Ranking</Text>
                </View>

                <View style={styles.containerRanking}>
                    {
                        elementos.map((item, index) => {
                            return (
                                <Text style={styles.elementos}>{item['nickname']} - {item['pontuacao']} ponto(s)</Text>
                            )
                        })
                    }
                </View>
                <View style={styles.containerBTN}>
                    <Button
                        color='#1785C1'
                        title='RANKING'
                        onPress={
                            () =>{
                                firebase.auth.signOut()
                                this.props.navigation.navigate('Classifiqui')
                            }

                        }
                    />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10
    },

    containerIMG: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagem: {
        width: '50%',
        height: 100
    },

    textRanking: {
        color: '#fa7921',
        fontSize: 25,
        marginBottom: 5,
        padding: 2,
        borderRadius: 5,
        marginTop: 5
    },

    containerRanking: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'auto',
        padding: 15
    },

    elementos:{
        color: '#fa7921',
        fontSize: 20,
        padding: 2,
        borderRadius: 5,
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
})