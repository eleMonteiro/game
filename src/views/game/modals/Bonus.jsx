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
                    .update({ pontuacao: player.pontuacao + 1 })
            }

            if (filho == 6 || filho == 7) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ pontuacao: player.pontuacao + 2 })
            }

            if (filho == 10 || filho == 8) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ pontuacao: player.pontuacao + 3 })
            }

            if (filho == 10) {
                firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
                    .update({ pontuacao: player.pontuacao + 1 })
            }
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }

    render() {
        const { bonus } = this.state
        return (
            <View style={styles.container}>
                {
                    bonus &&
                    <View style={styles.containerImagem}>
                        <Image source={{ uri: bonus['url'] }} style={styles.imagem} />
                        <Button
                            color='#1785C1'
                            title='VOLTAR'
                            onPress={
                                () => {
                                    this.props.route.params.mudarVez(this.props.route.params.vez)
                                    this.props.navigation.goBack()
                                }
                            }
                        />
                    </View>
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

    containerImagem: {
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        padding: 5
    },

    imagem: {
        width: '100%',
        height: '80%',
    },
})