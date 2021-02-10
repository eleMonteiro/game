import React, { Component } from "react";
import { Text, View, StyleSheet, Button, Alert, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import CardFlip from 'react-native-card-flip';

import * as firebase from '../../../api/firebase'

const tipos = [
    {
        text: "Requisito de Negócio",
        tipo: "requisito-negocio",
    },
    {
        text: "Regra de Negócio",
        tipo: "regras-de-negocio",
    },
    {
        text: "Restrição",
        tipo: "restricao",
    }, {
        text: "Requisitos de Interface Externa",
        tipo: "requisitos-de-interface-externa",
    },
    {
        text: "Feature",
        tipo: "feature",
    },
    {
        text: "Requisito Funcional",
        tipo: "requisito-funcional",
    },
    {
        text: "Requisito Não-Funcional",
        tipo: "requisito-nao-funcional",
    }, {
        text: "Atributo de Qualidade",
        tipo: "atributo-de-qualidade",
    },
    {
        text: "Requisito de Sistema",
        tipo: "requisito-de-sistema",
    },
    {
        text: "Requisito de Usuário",
        tipo: "requisito-de-usuario",
    }
]

export default class AjudaScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            analista: null,
            programador: null,
            user: this.props.route.params.user,
            sala: this.props.route.params.sala,
            req: this.props.route.params.req,
            tipos: this.props.route.params.tipos,
            ajudas: []
        }

        this.usarAnalista = this.usarAnalista.bind(this)
    }

    componentDidMount() {
        const sala = this.state.sala
        const user = this.state.user.nickname
        const player = sala.players[user]

        this.setState({ player: player })

        if (!this.state.analista) {
            const analistaRef = firebase.db.ref('ajudas/').child('0');
            analistaRef.on('value', (snapshot) => {
                this.setState({ analista: snapshot.val() })
            })
        }

        if (!this.state.programador) {
            const programadorRef = firebase.db.ref('ajudas/').child('1');
            programadorRef.on('value', (snapshot) => {
                this.setState({ programador: snapshot.val() })
            })
        }
    }

    usarAnalista() {
        const sala = this.state.sala
        const user = this.state.user.nickname
        const player = this.state.sala.players

        firebase.db.ref('rooms/' + sala.name + '/players/' + user).update({ ajudasAnalista: player.ajudasAnalista - 1 })

        const req = this.state.req['tipo']
        var resposta = null

        for (let i = 0; i < tipos.length; i++) {
            if (tipos[i].tipo == req) {
                resposta = tipos[i].text
            }
        }

        var msg = "" + resposta

        Alert.alert(
            "Tipo do Requisito",
            msg,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () =>
                        this.props.navigation.navigate('Classificar', {
                            tipos: this.state.tipos,
                            req: this.state.req,
                            user: this.state.user,
                            mudarVez: this.props.route.params.mudarVez,
                            vez: this.props.route.params.vez,
                            classificarRequisito: this.props.route.params.classificarRequisito
                        })
                }
            ],
            { cancelable: false }
        )

    }


    usarProgramador() {
        const sala = this.state.sala
        const user = this.state.user.nickname
        const player = this.state.sala.players

        firebase.db.ref('rooms/' + sala.name + '/players/' + user).update({ ajudasProgramador: player.ajudasProgramador - 1 })

        const req = this.state.req['tipo']

        const filho = []
        while (numeros.length < 3) {
            var aleatorio = Math.floor(Math.random() * 10)
            if (filho.indexOf(aleatorio) == -1 && req != tipos[aleatorio].tipo)
                filho.push(aleatorio);
        }

        const respostas = []
        respostas.push(tipos[filho[0]].text)
        respostas.push(tipos[filho[1]].text)

        for (let i = 0; i < tipos.length; i++) {
            if (tipos[i].tipo == req) {
                respostas.push(tipos[i].text)
            }
        }

        var m = respostas.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = respostas[m];
            respostas[m] = respostas[i];
            respostas[i] = t;
        }

        var msg = "1. " + respostas[0] + "; 2. " + respostas[1] + "; 3. " + respostas[2]

        Alert.alert(
            "Tipos possíveis",
            msg,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.props.navigation.navigate('Classificar', { tipos: this.state.tipos, req: this.state.req, user: this.state.user }) }
            ],
            { cancelable: false }
        )
    }

    render() {
        const { analista, programador, player, ajudas } = this.state

        return (
            <View style={styles.container}>
                <CardFlip style={styles.cardContainer} ref={card => (this.card = card)}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.card]}
                        onPress={() => this.card.flip()}>
                        {
                            analista && player.ajudasAnalista >= 1 &&
                            <Image source={{ uri: analista['url'] }} style={styles.imagem} />
                        }
                        {
                            analista && player.ajudasAnalista >= 1 &&
                            <View style={styles.button}>
                                <Text style={styles.text}>Ajudas Restantes: {player.ajudasAnalista}</Text>

                                <Button
                                    color='#0D7A18'
                                    title='USAR AJUDA'
                                    onPress={() => this.usarAnalista}
                                />

                            </View>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.card]}
                        onPress={() => this.card.flip()}>
                        {
                            programador && player.ajudasProgramador >= 1 &&
                            <Image source={{ uri: programador['url'] }} style={styles.imagem} />
                        }
                        {
                            programador && player.ajudasProgramador >= 1 &&
                            <View style={styles.button}>
                                <Text style={styles.text}>Ajudas Restantes: {player.ajudasProgramador}</Text>

                                <Button
                                    color='#0D7A18'
                                    title='USAR AJUDA'
                                    onPress={() => this.usarProgramador}
                                />
                            </View>
                        }
                    </TouchableOpacity>
                </CardFlip>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'stretch',
        backgroundColor: '#feddc7',
    },

    imagem: {
        width: '100%',
        height: 500,
    },

    button: {
        width: 'auto',
        alignItems: 'stretch',
        margin: 30,
    },

    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        padding: 2,
        borderRadius: 5,
        marginTop: 5,
        textAlign: 'center'
    },

    cardContainer: {
        flex: 1,
        padding: 20,
    },

    card: {
        width: '100%',
        height: '100%',
        borderRadius: 5,

        justifyContent: 'center',
        alignItems: 'center',


        shadowColor: 'rgba(0,0,0,0.5)',

        shadowOffset: {
            width: 0,
            height: 1,
        },

        shadowOpacity: 0.5,
    },
})
