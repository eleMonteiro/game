import React, { Component } from "react";
import { Text, Button, Image, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as firebase from '../../api/firebase'


export default class Initial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            sala: null,
            user: null,
            players: 0,
            tipos: null,
            bonus: null
        }
    }

    componentDidMount() {
        this.players()
        this.getUser()
    }

    getUser() {
        var userId = firebase.auth.currentUser.uid;

        firebase.db.ref('/users/' + userId).once('value').then((snapshot) => {
            this.setState({ user: snapshot.val() })
        });
    }

    getSala(projeto) {
        const name = this.props.route.params.nome
        const proj = projeto

        firebase.storage.ref('/' + proj + '/').listAll().then(function (res) {
            res.items.forEach((itemRef) => {

                var tipo = itemRef.name.split('carta-')[1]
                firebase.db.ref('rooms/' + name + '/reqs/' + itemRef.name.split('.')[0]).set({
                    name: itemRef.name.split('.')[0],
                    url: itemRef.fullPath,
                    classificada: false,
                    classificou: null,
                    tipo: tipo.split(/(-\d)/)[0]
                })

                firebase.storage.ref(itemRef.fullPath).getDownloadURL()
                    .then(function (url) {
                        firebase.db.ref('rooms/' + name + '/reqs/' + itemRef.name.split('.')[0])
                            .update({ url: url });
                    })
            })
        }).catch(function (error) {
            console.log(error);
        });


    }

    players() {
        var starCountRef = firebase.db.ref('rooms/' + this.props.route.params.nome);
        starCountRef.on('value', (snapshot) => {
            const data = snapshot.val();
            this.setState({ name: data.name })
            this.setState({ sala: data })
            this.setState({ players: data.qtd })
        });

        firebase.db.ref('tipos/').once('value').then((snapshot) => {
            this.setState({ tipos: snapshot.val() })
        })

    }

    render() {

        const { sala, user, players, tipos } = this.state

        return (
            <View style={styles.container}>
                <Image source={require('../home/LOGO-3.1-LARANJA.png')} style={styles.imagem} />

                <ActivityIndicator animating={this.state.players <= 1} size="small" color="#FA7921" />
                {players <= 1 && <Text style={styles.loading}>ESPERANDO JOGADORES</Text>}

                <View style={styles.containerBTN}>
                    {
                        players == 1 && !sala.reqs &&
                        <>
                            <Text style={styles.projeto}>ESCOLHA O PROJETO QUE QUER QUE SUA EQUIPETRABALHE.</Text>
                            <Button
                                color='#FA7921'
                                title="GREATOUR"
                                onPress={
                                    () => Alert.alert(
                                        "GREATOUR",
                                        "É um aplicativo desenvolvido no Great para apoiar os visitantes do laboratório, que funciona como um guia móvel de visita. Mostra ao usuário sua localização, as salas, informações da sala, descrição dos funcionários ou pesquisadores e o acompanha em tempo real pelo seu tour de visita no laboratório.",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            { text: "OK", onPress: () => this.getSala('GREATOUR') }
                                        ],
                                        { cancelable: false }
                                    )
                                }
                            />

                            <Button
                                color='#FA7921'
                                title="GREAT PRINT"
                                onPress={
                                    () => Alert.alert(
                                        "GREAT PRINT",
                                        "É uma aplicação que foi desenvolvida para apoiar a impressão de documentos no Great, para os funcionários dos diversos setores, como do financeiro. Com esse aplicativo os membros do Great também podem imprimir a partir de seus smartphones e essa impressão deve ser feita na impressora mais próxima do usuário requisitante.",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                stSyle: "cancel"
                                            },
                                            { text: "OK", onPress: () => this.getSala('GREATPRINT') }
                                        ],
                                        { cancelable: false }
                                    )
                                }
                            />

                            <Button
                                color='#FA7921'
                                title="ADOTE"
                                onPress={
                                    () => Alert.alert(
                                        "ADOTE",
                                        "É um sistema para apoiar o cuidado e adoção de animais. Centraliza as burocracias de adoção entre quem cuida dos animais resgatados e quem adota, como também quem ajuda com os custos dos cuidados.",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                stSyle: "cancel"
                                            },
                                            { text: "OK", onPress: () => this.getSala('ADOTE') }
                                        ],
                                        { cancelable: false }
                                    )
                                }
                            />

                            <Button
                                color='#FA7921'
                                title="CAFETERIA"
                                onPress={
                                    () => Alert.alert(
                                        "CAFETERIA",
                                        "É um sistema retirado do livro base da disciplina de Requisitos de Software. Serve para apoiar os funcionários de uma empresa gerenciando seus pedidos de comida.",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                stSyle: "cancel"
                                            },
                                            { text: "OK", onPress: () => this.getSala('CAFETERIA') }
                                        ],
                                        { cancelable: false }
                                    )}
                            />
                        </>
                    }
                    {
                        players >= 1 &&
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Game', { sala: sala, user: user, tipos: tipos })}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>INICIAR</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#feddc7',
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },

    imagem: {
        width: 400,
        height: 400,
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        margin: 15,
        color: '#111111'
    },

    loading: {
        color: '#FA7921',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 15
    },

    projeto: {
        color: '#FA7921',
        fontSize: 15,
        marginBottom: 15,
        textAlign: "center",
    },

    button: {
        width: 'auto',
        backgroundColor: '#FA7921',
        margin: 10,
    },

    buttonText: {
        padding: 10,
        color: 'white',
        fontSize: 15,
    },
})