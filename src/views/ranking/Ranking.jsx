import React, { Component } from "react";
import { Text, Image, View, StyleSheet, Button } from "react-native";

import { BackHandler } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Divider from "react-native-divider";

import * as firebase from '../../api/firebase'

export default class Ranking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            elementos: []
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        const sala = this.props.route.params.sala
        var obj
        const playerRef = firebase.db.ref('rooms/' + sala + '/players')
        playerRef.on('value', (snapshot) => {
            obj = snapshot.val()
        })

        var elementos = []

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                elementos.push(obj[i])
            }
        }

        elementos.sort(function (a, b) { return b['requisitosClassificados'] - a['requisitosClassificados'] })

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
            <ScrollView style={{ backgroundColor: 'white' }}>
                <View style={styles.containerIMG}>
                    <Image source={require('./ranking.png')} style={styles.imagem} />
                    <Text style={styles.textRanking}>Ranking</Text>
                </View>

                <View style={styles.containerRanking}>
                    {
                        elementos.map((item, index) => {
                            return (
                                <View style={styles.container}>
                                    { index == 0 &&
                                        <>
                                            <Divider borderColor='#fa7921' color='black' orientation='center'><Text style={styles.elementos}>CAMPEÃO</Text></Divider>
                                            <Text style={styles.elementos}>{item['nickname']} </Text>

                                            <Text>Pontuação: {item['pontuacao']} ponto(s)</Text>
                                            <Text>Requisitos Classificados: {item['requisitosClassificados']}</Text>
                                        </>
                                    }
                                    { index > 0 &&
                                        <>
                                            <Divider borderColor='#fa7921' color='black' orientation='center'><Text style={styles.elementos}>{index + 1}</Text></Divider>
                                            <Text style={styles.elementos}>{item['nickname']} </Text>

                                            <Text>Pontuação: {item['pontuacao']} ponto(s)</Text>
                                            <Text>Requisitos Classificados: {item['requisitosClassificados']}</Text>
                                        </>
                                    }
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.containerBTN}>
                    <Button
                        color='#1785C1'
                        title='LOGOUT'
                        onPress={
                            () => {
                                firebase.auth.signOut()
                                this.props.navigation.navigate('Classifiqui')
                            }

                        }
                    />
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10,
        width: '100%'
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

    elementos: {
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