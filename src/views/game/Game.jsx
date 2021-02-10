import React, { Component } from "react";
import { Text, Image, View, StyleSheet, Button, Alert } from "react-native";

import * as firebase from '../../api/firebase'

import { BackHandler } from 'react-native';

function Item(props) {
    var requisitos = props.reqs
    var reqs = []

    for (var [key, value] of Object.entries(requisitos)) {
        reqs.push(value);
    }

    for (let i = 0; i < reqs.length; i++) {
        const element = reqs[i];
        if (element['classificada'] == false) return (
            <>
                <View style={styles.containerImagem}>
                    <Image
                        source={{ uri: element['url'] }}
                        style={styles.imagem}
                    ></Image>

                </View>

                <View style={styles.containerBTN}>
                    {props.vez == props.user.nickname &&
                        <>
                            <View style={styles.buttonClassificar}>
                                <Button
                                    color='#0D7A18'
                                    title='CLASSIFICAR'
                                    onPress={
                                        () =>
                                            props.navigation.navigate('Classificar',
                                                {
                                                    tipos: props.tipos,
                                                    req: element,
                                                    user: props.user,
                                                    vez: props.vez,
                                                    mudarVez: props.mudarVez,
                                                    classificarRequisito: props.classificarRequisito,
                                                })
                                    }
                                />
                            </View>

                            <View style={styles.buttonAjuda}>
                                <Button
                                    color='#1785C1'
                                    title='AJUDA'
                                    onPress={
                                        () =>
                                            props.navigation.navigate('Ajuda',
                                                {
                                                    req: element,
                                                    sala: props.sala,
                                                    user: props.user,
                                                    tipos: props.tipos,
                                                    vez: props.vez,
                                                    mudarVez: props.mudarVez,
                                                    classificarRequisito: props.classificarRequisito,
                                                })
                                    }
                                />
                            </View>
                        </>
                    }
                </View>
            </>

        )
    }

    return (
        <>
            <View style={styles.containerImagem}>
                <Image source={require('./carta-verso.png')} style={styles.imagem}></Image>
            </View>

            <View style={styles.containerBTN}>
                <Button
                    color='#1785C1'
                    title='RANKING'
                    onPress={
                        () =>
                            props.navigation.navigate('Ranking', { players: props.sala.players })
                    }
                />
            </View>
        </>
    )

}


export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sala: this.props.route.params.sala,
            user: this.props.route.params.user,
            tipos: this.props.route.params.tipos,
            requisitosClassificar: this.props.route.params.sala.reqs,
            ordemJogada: null,
            vez: null,
        }

        this.mudarVez = this.mudarVez.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
        this.classificarRequisito = this.classificarRequisito.bind(this)
    }


    componentDidMount() {
        firebase.db.ref('rooms/' + this.state.sala.name).on('value', (snapshot) => {
            const data = snapshot.val();
            this.setState({ ordemJogada: data.ordemDeJogada })
            this.setState({ vez: data.ordemDeJogada[0] })
            this.setState({ requisitosClassificar: data.reqs });
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return false;
    }

    mudarVez(vez) {
        for (let i = 0; i < this.state.ordemJogada.length; i++) {
            const element = this.state.ordemJogada[i];
            if (vez == element && i == (this.state.ordemJogada.length - 1)) {
                this.setState({ vez: this.state.ordemJogada[0] })
            } else if (vez == element) {
                this.setState({ vez: this.state.ordemJogada[i + 1] })
            }
        }
    }

    classificarRequisito(requisito, tipo, user) {
        const _requisito = requisito
        const _tipo = _requisito['tipo']

        if (_tipo == tipo) {
            this.editarRequisitos(_requisito)
            this.pontuacao(user)
            this.props.route.navigation.navigate('Bonus', {
                vez: this.state.vez,
                mudarVez: this.mudarVez.bind(this),
                sala: this.state.sala,
                user: this.state.user
            })

        } else {
            Alert.alert('VOCÊ ERROU!');
            this.mudarVez(this.state.vez)
        }
    }

    editarRequisitos = (requisito) => {
        firebase.db.ref('rooms/' + this.state.sala.name + '/reqs/' + requisito['name'])
            .update({ classificada: true })
    }

    pontuacao = (user) => {
        const sala = this.state.sala
        const _user = user.nickname
        const player = sala.players[_user]

        firebase.db.ref('rooms/' + sala.name + '/players/' + _user)
            .update({ pontuacao: player.pontuacao + 1, requisitosClassificados: player.requisitosClassificados + 1 })

    }

    render() {
        const { sala, tipos, user, vez, requisitosClassificar, bonus } = this.state


        return (
            <View style={styles.container}>
                <Item
                    reqs={requisitosClassificar}
                    sala={sala}
                    tipos={tipos}
                    user={user}
                    navigation={this.props.navigation}
                    vez={vez}
                    mudarVez={this.mudarVez.bind(this)}
                    classificarRequisito={this.classificarRequisito.bind(this)}
                    bonus={bonus}
                ></Item>
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

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },

    imagem: {
        width: '95%',
        height: 495,
    },

    containerImagem: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonClassificar: {
        width: 'auto',
        margin: 10,
    },

    buttonAjuda: {
        width: 'auto',
        margin: 10,
    },

    buttonText: {
        padding: 10,
        color: 'white',
        fontSize: 15,
    },

    time: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 5,
        marginTop: 5
    }
})