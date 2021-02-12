import React, { Component } from "react";
import { Text, TextInput, Image, View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Button } from "react-native";
import { BackHandler } from 'react-native';

import * as firebase from '../../api/firebase'

export default class Room extends Component {

    constructor(props) {
        super(props);
        this.state = { nome: '', loading: false, user: '' }

        this.sala = this.sala.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        var userId = firebase.auth.currentUser.uid;
        firebase.db.ref('/users/' + userId).once('value').then((snapshot) => {
            this.setState({ user: snapshot.val() })
        });

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }


    async sala() {
        if (this.state.nome) {
            var sala = (await firebase.db.ref('rooms/' + this.state.nome).once('value')).val()


            if (sala) {
                if (sala.qtd < sala.max) {

                    if (!sala.players.hasOwnProperty(this.state.user.nickname)) {
                        var ordem = sala.ordemDeJogada
                        ordem.push({ nickname: this.state.user.nickname, vez: false })

                        firebase.db.ref('rooms/' + sala.name).update({ qtd: sala.qtd + 1, ordemDeJogada: ordem });
                        firebase.db.ref('rooms/' + sala.name + '/players/' + this.state.user.nickname)
                            .set(
                                {
                                    nickname: this.state.user.nickname,
                                    ajudasAnalista: 1,
                                    ajudasProgramador: 2,
                                    requisitosClassificados: 0,
                                    pontuacao: 0
                                }
                            )

                        this.setState({ loading: false })
                    }

                    this.setState({ loading: false })
                    this.props.navigation.navigate('Inicial', { nome: this.state.nome })
                } else {
                    Alert.alert('Sala cheia!')
                }
            } else {

                const ordem = []
                ordem.push({ nickname: this.state.user.nickname, vez: true })

                const element = {
                    name: this.state.nome,
                    max: 7,
                    min: 3,
                    qtd: 0,
                    ordemDeJogada: ordem,
                    vez: this.state.user.nickname
                }

                firebase.db.ref('rooms/' + element.name).set(element)
                firebase.db.ref('rooms/' + element.name).update({ qtd: element.qtd + 1 });
                firebase.db.ref('rooms/' + element.name + '/players/' + this.state.user.nickname).set({
                    nickname: this.state.user.nickname,
                    ajudasAnalista: 1,
                    ajudasProgramador: 2,
                    requisitosClassificados: 0,
                    pontuacao: 0
                })

                this.setState({ loading: false })
                this.props.navigation.navigate('Inicial', { nome: this.state.nome })
            }
        } else {
            Alert.alert('Campo vazio!')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerImagem}>
                    <Image source={require('../home/LOGO-3.1-LARANJA.png')} style={styles.imagem} />
                    <Text>Vamos Começar!</Text>

                    <ActivityIndicator animating={this.state.loading} size="small" color="#FA7921" />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(nome) => this.setState({ nome })}
                        placeholder="Nome da Sala"
                    />
                    <View style={styles.containerBTN}>
                        <Button
                            color='#FA7921'
                            title='JOGAR'
                            onPress={
                                () => {
                                    this.setState({ loading: true })
                                    this.sala()
                                }
                            }
                        />
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: '#feddc7',
    },

    containerImagem: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },

    imagem: {
        width: '40%',
        height: '40%',
    },

    containerBTN: {
        width: "80%",
        alignItems: 'stretch',
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        color: '#111111'
    }
})