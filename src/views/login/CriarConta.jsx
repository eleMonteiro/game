import React, { Component } from "react";
import { Text, TextInput, Image, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as firebase from '../../api/firebase'

export default class CriarConta extends Component {

    constructor(props) {
        super(props);
        this.state = { nome: '', email: '', password: '', loading: false }

        this.criarConta = this.criarConta.bind(this)
    }

    async criarConta() {

        if (this.state.nome != null && this.state.email != null && this.state.password != null) {
            const { user } = await firebase.auth.createUserWithEmailAndPassword(this.state.email, this.state.password)

            if (user) {
                await firebase.db.ref('users/' + user.uid).set({
                    nickname: this.state.nome,
                });
                this.setState({ loading: false })
                this.props.navigation.navigate('Login')

            } else {
                this.setState({ loading: false })
                Alert.alert('Não foi possível criar conta!')
            }

        } else {
            this.setState({ loading: false })
            Alert.alert('Campos vazios!')
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../home/LOGO-3.1-LARANJA.png')} style={styles.imagem} />

                <ActivityIndicator animating={this.state.loading} size="small" color="#FA7921" />

                <TextInput
                    style={styles.textInput}
                    onChangeText={(nome) => this.setState({ nome })}
                    placeholder="Nickname"
                    textContentType="nickname"
                />

                <TextInput
                    style={styles.textInput}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder="Email"
                    textContentType="emailAddress"
                />

                <TextInput
                    style={styles.textInput}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder="Senha"
                    textContentType="password"
                    secureTextEntry={true}
                />

                <View style={styles.containerBTN}>
                    <TouchableOpacity
                        onPress={
                            () => {
                                this.setState({ loading: true })
                                this.criarConta()
                            }
                        }>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>CRIAR</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Classifiqui')}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>CANCELAR</Text>
                        </View>
                    </TouchableOpacity>
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
        backgroundColor: '#feddc7'
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagem: {
        width: 100,
        height: 200,
    },

    button: {
        width: 'auto',
        alignItems: 'center',
        backgroundColor: '#FA7921',
        margin: 10
    },

    buttonText: {
        padding: 10,
        color: 'white',
        fontSize: 15
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        margin: 10,
        color: '#111111'
    },
})