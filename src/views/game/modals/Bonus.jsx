import React, { Component } from "react";
import { Button, Image, StyleSheet, Text, View, } from "react-native";

import { BackHandler } from 'react-native';

import * as firebase from '../../../api/firebase'

export default class BonusScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bonus: null,
            sala: this.props.route.params.sala,
            user: this.props.route.params.user
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        if (!this.state.bonus) {
            const min = 1;
            const max = 11;
            const filho = Math.floor(min + Math.random() * (max - min))

            const bonusRef = firebase.db.ref('bonus/').child(filho);
            bonusRef.on('value', (snapshot) => {
                this.setState({ bonus: snapshot.val() });
            })

            const sala = this.state.sala
            const _user = this.state.user.nickname
            const player = this.state.sala.players[_user]

            if (filho == 1 && player.ajudasAnalista < 1) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ ajudasAnalista: player.ajudasAnalista + 1 })
            }

            if (filho == 2 && player.ajudasProgramador < 1) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ ajudasProgramador: player.ajudasProgramador + 1 })
            }

            if (filho == 3) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ ajudasAnalista: player.ajudasAnalista + 1 })
            }

            if (filho == 4 || filho == 9) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ ajudasProgramador: player.ajudasProgramador + 1 })
            }

            if (filho == 5) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ pontuacao: player.pontuacao + 1})
            }

            if (filho == 6 || filho == 7) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ pontuacao: player.pontuacao + 2})
            }

            if (filho == 10 || filho == 8) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ pontuacao: player.pontuacao + 3})
            }

            if (filho == 10) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ pontuacao: player.pontuacao + 1})
            }
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return false;
    }

    render() {
        const { bonus } = this.state
        return (
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#feddc7' }}>
                {
                    bonus &&
                    <>
                        <Image source={{ uri: bonus['url'] }} style={styles.imagem} />

                        <Button
                            color='#1785C1'
                            title='VOLTAR'
                            onPress={
                                () => {
                                    this.props.route.params.tipos.mudarVez(this.props.route.params.vez)
                                    this.props.navigation.goBack()
                                }
                            }
                        />
                    </>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#feddc7',
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagem: {
        width: 400,
        height: 500,
    },

    button: {
        marginBottom: 30,
        width: 'auto',
        alignItems: 'center',
        backgroundColor: '#FA7921',
        borderRadius: 10,
        margin: 15
    },

    buttonText: {
        padding: 10,
        color: 'white',
        fontSize: 15
    },
})