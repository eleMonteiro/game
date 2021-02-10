import React, { Component } from "react";
import { Text, Image, View, StyleSheet, Button } from "react-native";

import * as firebase from '../../api/firebase'

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
                    <Image source={{ uri: element['url'] }} style={styles.imagem}></Image>

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

    return <Text>TERMINOU</Text>
}


export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sala: this.props.route.params.sala,
            user: this.props.route.params.user,
            tipos: this.props.route.params.tipos,
            seg: 0,
            min: 0,
            requisitosClassificar: this.props.route.params.sala.reqs,
            ordemJogada: null,
            vez: null
        }

        this.mudarVez = this.mudarVez.bind(this)
    }


    componentDidMount() {
        firebase.db.ref('rooms/' + this.state.sala.name).on('value', (snapshot) => {
            const data = snapshot.val();
            this.setState({ ordemJogada: data.ordemDeJogada })
            this.setState({ vez: data.ordemDeJogada[0] })
            this.setState({ requisitosClassificar: data.reqs });
        });

        setInterval(this.clock, 1000);
    }

    mudarVez(vez) {
        console.log(vez);
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
        }
        else console.log('ERROUUU');
    }

    editarRequisitos = (requisito) => {
        firebase.db.ref('rooms/' + this.state.sala.name + '/reqs/' + requisito['name'])
            .update({ classificada: true })

    }

    pontuacao = (user) => {
        const sala = this.state.sala
        const _user = user.nickname
        const player = sala.players[_user]

        firebase.db.ref('rooms/' + sala.name + '/players/' + user)
            .update({ pontuacao: player.pontuacao + 1, requisitosClassificados: player.requisitosClassificados + 1 })

    }

    clock = () => {
        if (this.state.seg == 60) {
            this.setState({ min: this.state.min + 1 })
            this.setState({ seg: 0 })
        }
        if (this.state.min == 5) {
            this.setState({ min: 0 })
            this.setState({ seg: 0 })
        }

        this.setState({ seg: this.state.seg + 1 })
    }


    render() {
        const { sala, tipos, min, seg, user, vez, requisitosClassificar } = this.state


        return (
            <View style={styles.container}>
                <View style={
                    {
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }>
                    <Text style={styles.time}>Tempo {"0" + min} : {seg >= 10 ? seg : "0" + seg}</Text>
                </View>

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