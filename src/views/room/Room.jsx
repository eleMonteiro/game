import React, { Component } from "react";
import { Text, TextInput, Image, View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
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
        return false;
    }
    

    async sala() {
        if (this.state.nome) {
            var sala = (await firebase.db.ref('rooms/' + this.state.nome).once('value')).val()


            if (sala) {
                if (sala.qtd < sala.max) {

                    if (!sala.players.hasOwnProperty(this.state.user.nickname)) {
                        var ordem = sala.ordemDeJogada
                        ordem.push(this.state.user.nickname)
                        
                        firebase.db.ref('rooms/' + sala.name).update({ qtd: sala.qtd + 1, ordemDeJogada: ordem  });
                        firebase.db.ref('rooms/' + sala.name + '/players/' + this.state.user.nickname)
                            .set(
                                {
                                    nickname: this.state.user.nickname,
                                    ajudasAnalista: 2,
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
                ordem.push(this.state.user.nickname)

                const element = {
                    name: this.state.nome,
                    max: 7,
                    min: 3,
                    qtd: 0,
                    ordemDeJogada: ordem
                }

                firebase.db.ref('rooms/' + element.name).set(element)
                firebase.db.ref('rooms/' + element.name).update({ qtd: element.qtd + 1 });
                firebase.db.ref('rooms/' + element.name + '/players/' + this.state.user.nickname).set({
                    nickname: this.state.user.nickname,
                    ajudasAnalista: 1,
                    ajudasProgramador: 3,
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
                <Image source={require('../home/LOGO-3.1-LARANJA.png')} style={styles.imagem} />
                <Text>Vamos Começar!</Text>

                <ActivityIndicator animating={this.state.loading} size="small" color="#FA7921" />

                <TextInput
                    style={styles.textInput}
                    onChangeText={(nome) => this.setState({ nome })}
                    placeholder="Nome da Sala"
                />

                <TouchableOpacity
                    onPress={
                        () => {
                            this.setState({ loading: true })
                            this.sala()
                        }
                    }>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>JOGAR</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#feddc7'
    },

    imagem: {
        width: 100,
        height: 200,
        marginBottom: 15
    },

    button: {
        marginBottom: 30,
        width: 250,
        alignItems: 'center',
        backgroundColor: '#FA7921',
    },

    buttonText: {
        padding: 10,
        color: 'white'
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        margin: 15,
        color: '#111111'
    }
})