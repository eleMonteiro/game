import React, { Component } from "react";
import { Text, Image, View, StyleSheet, Button, Alert } from "react-native";

import * as firebase from '../../api/firebase'

import { BackHandler } from 'react-native';

function Item(props) {
    var requisitos = props.reqs

    for (let i = 0; i < requisitos.length; i++) {
        const element = requisitos[i];
        if (element['classificada'] == false) {
        return (
            <View style={styles.containerImagem}>
                <Image
                    source={{ uri: element['url'] }}
                    style={styles.imagem}
                ></Image>

                {props.vez == props.user.nickname &&
                    <>
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
                                            indice: i
                                        })
                            }
                        />

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
                    </>
                }
            </View>
        )}
    }

    return (
        <>
            <View style={styles.containerImagemColor}>
                <Image source={require('./carta-verso.png')} style={styles.imagem}></Image>
                <Button
                    color='#1785C1'
                    title='RANKING'
                    onPress={
                        () =>
                            props.navigation.navigate('Ranking', { sala: props.sala.name })
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
            bonus: false
        }

        this.mudarVez = this.mudarVez.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
        this.classificarRequisito = this.classificarRequisito.bind(this)
    }


    componentDidMount() {
        firebase.db.ref('rooms/' + this.state.sala.name).on('value', (snapshot) => {
            const data = snapshot.val();
            this.setState({ ordemJogada: data.ordemDeJogada })
            this.setState({ vez: data.vez })
            this.setState({ requisitosClassificar: data.reqs })
        });

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }

    mudarVez(vez) {
        for (let i = 0; i < this.state.ordemJogada.length; i++) {
            const element = this.state.ordemJogada[i];
            if (vez == element['nickname'] && i == (this.state.ordemJogada.length - 1)) {

                firebase.db.ref('rooms/' + this.state.sala.name + '/ordemDeJogada/' + i).update({ vez: false })

                const j = 0
                firebase.db.ref('rooms/' + this.state.sala.name + '/ordemDeJogada/' + j).update({ vez: true })
                firebase.db.ref('rooms/' + this.state.sala.name).update({ vez: this.state.ordemJogada[0]['nickname'] })

            } else if (vez == element['nickname']) {
                firebase.db.ref('rooms/' + this.state.sala.name + '/ordemDeJogada/' + i).update({ vez: false })

                const j = i + 1

                if (j < this.state.ordemJogada.length) {
                    console.log('oiiii' + this.state.ordemJogada[j]);
                    firebase.db.ref('rooms/' + this.state.sala.name + '/ordemDeJogada/' + j).update({ vez: true })
                    firebase.db.ref('rooms/' + this.state.sala.name).update({ vez: this.state.ordemJogada[j]['nickname'] })
                } else {
                    firebase.db.ref('rooms/' + this.state.sala.name + '/ordemDeJogada/' + j).update({ vez: true })
                    firebase.db.ref('rooms/' + this.state.sala.name).update({ vez: this.state.ordemJogada[0]['nickname'] })
                }
            }
        }
        this.setState({ bonus: false })
    }

    classificarRequisito(requisito, tipo, user, indice) {
        const _requisito = requisito
        const _tipo = _requisito['tipo']

        if (_tipo == tipo) {
            this.editarRequisitos(indice)
            this.pontuacao(this.state.vez)
            this.setState({ bonus: true })
        } else {
            Alert.alert('VOCÊ ERROU!');
            this.mudarVez(this.state.vez)
        }
    }

    editarRequisitos = (requisito) => {
        firebase.db.ref('rooms/' + this.state.sala.name + '/reqs/' + requisito)
            .update({ classificada: true })
    }

    pontuacao = (user) => {
        const sala = this.state.sala
        var player

        const bonusRef = firebase.db.ref('rooms/' + sala.name + '/players').child(user);
        bonusRef.on('value', (snapshot) => {
            player = snapshot.val()
        })

        firebase.db.ref('rooms/' + sala.name + '/players/' + player.nickname)
            .update({ pontuacao: player.pontuacao + 1, requisitosClassificados: player.requisitosClassificados + 1 })

    }

    render() {
        const { sala, tipos, user, vez, requisitosClassificar, bonus } = this.state


        return (
            <View style={styles.container}>
                {!bonus &&
                    <Item
                        reqs={requisitosClassificar}
                        sala={sala}
                        tipos={tipos}
                        user={user}
                        navigation={this.props.navigation}
                        vez={vez}
                        mudarVez={this.mudarVez.bind(this)}
                        classificarRequisito={this.classificarRequisito.bind(this)}
                    ></Item>
                }

                {bonus &&
                    <>
                        <View style={styles.containerImagemColor}>
                            <Image source={require('./carta-verso.png')} style={styles.imagem}></Image>
                            <Button
                                color='#1785C1'
                                title='BONUS'
                                onPress={
                                    () =>
                                        this.props.navigation.navigate('Bonus', {
                                            vez: this.state.vez,
                                            mudarVez: this.mudarVez.bind(this),
                                            sala: this.state.sala,
                                            user: this.state.user
                                        })
                                }
                            />
                        </View>
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
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
    },

    imagem: {
        width: '100%',
        height: '80%',
    },

    containerImagem: {
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
    },

    containerImagemColor: {
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: '#fa7921'
    },

    textRanking: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },

    containerRanking: {
        alignItems: 'center',
    },
})