import React, { Component } from "react";
import { Text, TextInput, Image, View, StyleSheet, Alert, ActivityIndicator, Button } from "react-native";
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
                <View style={styles.containerImagem}>
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
                        <Button
                            color='#FA7921'
                            title='CRIAR'
                            onPress={
                                () => {
                                    this.setState({ loading: true })
                                    this.criarConta()
                                }
                            }
                        />
                        <View style={{ margin: 10 }}></View>
                        <Button
                            color='#FA7921'
                            title='CANCELAR'
                            onPress={
                                () => this.props.navigation.navigate('Classifiqui')
                            }
                        />
                    </View>
                </View>
            </View >
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

    containerBTN: {
        width: "80%",
        alignItems: 'stretch',
    },

    containerImagem: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 5
    },

    imagem: {
        width: '40%',
        height: '40%',
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        color: '#111111'
    },
})